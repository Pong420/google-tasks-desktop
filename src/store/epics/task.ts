import { empty, from, timer, of } from 'rxjs';
import {
  mergeMap,
  map,
  takeUntil,
  filter,
  mapTo,
  tap,
  debounce,
  groupBy,
  switchMap,
  pairwise,
  take,
  takeWhile,
  first,
  combineLatest,
  catchError,
  distinctUntilChanged
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  TaskActions,
  TaskActionTypes,
  AddTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess,
  SortTasks,
  SortTasksSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { Schema$Task } from '../../typings';

const apiEpic: Epic<TaskActions, TaskActions, RootState, EpicDependencies> = (
  action$,
  state$,
  { nprogress }
) =>
  action$.pipe(
    filter(action => !/Update|Sort/i.test(action.type)),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      // TODO: check this
      const tasklist = state$.value.taskList.currentTaskListId;

      const deleteTaskSuccess$ = (task?: string) =>
        from(tasksAPI.delete({ tasklist, task })).pipe(
          map<any, TaskActions>(() => ({
            type: TaskActionTypes.DELETE_TASK_SUCCESS
          }))
        );

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return from(
            tasksAPI.list({
              tasklist,
              showCompleted: true,
              showHidden: false
            })
          ).pipe(
            tap(() => nprogress.done()),
            map(({ data }) => data),
            map<tasks_v1.Schema$Tasks, TaskActions>(({ items }) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload: items || []
            })),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.ADD_TASK:
          return from(tasksAPI.insert({ tasklist })).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$Task, TaskActions>(task => {
              return {
                type: TaskActionTypes.ADD_TASK_SUCCESS,
                payload: {
                  ...task,
                  uuid: action.payload
                }
              };
            })
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success => success.payload.uuid === action.payload.uuid
              ),
              mergeMap(success => deleteTaskSuccess$(success.payload.id!))
            );
          }

          return deleteTaskSuccess$(action.payload.id);

        case TaskActionTypes.DELETE_COMPLETED_TASKS:
          return from(tasksAPI.clear({ tasklist })).pipe(
            mapTo<any, TaskActions>({
              type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS
            })
          );

        default:
          return empty();
      }
    })
  );

// FIXME:
const updateEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const request$ = (requestBody: Schema$Task) => {
    delete requestBody.completed;

    if (!requestBody.id) {
      throw new Error('update task request failed, id is missing');
    }

    return from(
      tasksAPI.update({
        tasklist: state$.value.taskList.currentTaskListId,
        task: requestBody.id,
        requestBody
      })
    ).pipe(
      map(({ data }) => data),
      map<tasks_v1.Schema$Task, UpdateTaskSuccess>(payload => ({
        type: TaskActionTypes.UPDATE_TASK_SUCCESS,
        payload
      })),
      catchError(err => {
        return empty();
      })
    );
  };

  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ => {
      return group$.pipe(
        debounce(action => timer(action.payload.id ? 1000 : 0)), // make this better
        switchMap(action => {
          // FIXME: make this better
          if (
            !state$.value.task.tasks.find(
              task => task.uuid === action.payload.uuid
            )
          ) {
            return empty();
          }

          if (action.payload.id === undefined) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success => success.payload.uuid === action.payload.uuid
              ),
              mergeMap(success =>
                request$({ ...success.payload, ...action.payload })
              )
            );
          }

          return request$(action.payload);
        })
      );
    })
  );
};

const sortTaskEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const todoTasks$ = state$.pipe(map(({ task }) => task.todoTasks));

  const request$ = (task: Schema$Task) =>
    todoTasks$.pipe(
      switchMap(todoTasks => from([undefined, ...todoTasks])),
      pairwise(),
      filter(([_, b]) => !!b && b.uuid === task.uuid),
      tap(arg => arg),
      switchMap(([previous, target]) =>
        from(
          tasksAPI.move({
            tasklist: state$.value.taskList.currentTaskListId,
            task: target!.id,
            previous: previous && previous.id
          })
        )
      ),
      map<any, SortTasksSuccess>(() => ({
        type: TaskActionTypes.SORT_TASKS_SUCCESS
      }))
    );

  return action$.pipe(
    ofType<TaskActions, SortTasks>(TaskActionTypes.SORT_TASKS),
    groupBy(action => {
      const todoTasks = state$.value.task.todoTasks;
      return todoTasks[action.payload.oldIndex].id;
    }),
    mergeMap(group$ => {
      return group$.pipe(
        switchMap(action => {
          const todoTasks = state$.value.task.todoTasks;
          const target = todoTasks[action.payload.newIndex];

          if (!target.id) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(success => success.payload.uuid === target.uuid),
              switchMap(success => request$(success.payload))
            );
          }

          return request$(target);
        })
      );
    })
  );
};

export default [apiEpic, updateEpic];
