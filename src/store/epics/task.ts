import { empty, from, timer } from 'rxjs';
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
  takeWhile,
  take
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  TaskActions,
  TaskActionTypes,
  NewTaskSuccess,
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

      const tasklist = state$.value.taskList.currentTaskListId;

      const deleteTaskRequest$ = (task?: string) =>
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

        case TaskActionTypes.NEW_TASK:
          const previousTask =
            typeof action.payload.insertAfter === 'number' &&
            state$.value.task.todoTasks[action.payload.insertAfter];
          const previous = previousTask ? previousTask.id : undefined;

          return from(tasksAPI.insert({ tasklist, previous })).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$Task, TaskActions>(task => {
              return {
                type: TaskActionTypes.ADD_TASK_SUCCESS,
                payload: {
                  ...task,
                  uuid: action.payload.uuid
                }
              };
            })
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload) {
            return action$.pipe(
              ofType<TaskActions, NewTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success => success.payload.uuid === action.payload.uuid
              ),
              mergeMap(success => deleteTaskRequest$(success.payload.id!))
            );
          }

          return deleteTaskRequest$(action.payload.id);

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
  const updateTaskRequest$ = (requestBody: Schema$Task) => {
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
      }))
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
              ofType<TaskActions, NewTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success => success.payload.uuid === action.payload.uuid
              ),
              mergeMap(success =>
                updateTaskRequest$({ ...success.payload, ...action.payload })
              )
            );
          }

          return updateTaskRequest$(action.payload);
        })
      );
    })
  );
};

const moveTaskEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const todoTasks$ = state$.pipe(
    map(({ task }) => task.todoTasks),
    take(1)
  );

  const moveTaskRequest$ = (task: Schema$Task) =>
    todoTasks$.pipe(
      switchMap(todoTasks => from([undefined, ...todoTasks])),
      pairwise(),
      filter(([_, b]) => !!b && b.uuid === task.uuid),
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
        type: TaskActionTypes.MOVE_TASKS_SUCCESS
      }))
    );

  return action$.pipe(
    ofType<TaskActions, SortTasks>(TaskActionTypes.MOVE_TASKS),
    groupBy(action => {
      // TODO: Make it better
      const todoTasks = state$.value.task.todoTasks;
      return todoTasks[action.payload.newIndex].uuid;
    }),
    mergeMap(group$ => {
      return group$.pipe(
        debounce(() => timer(500)),
        switchMap(action => {
          const todoTasks = state$.value.task.todoTasks;
          const target = todoTasks[action.payload.newIndex];

          if (!target.id) {
            return action$.pipe(
              ofType<TaskActions, NewTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(success => success.payload.uuid === target.uuid),
              switchMap(success => moveTaskRequest$(success.payload))
            );
          }

          return moveTaskRequest$(target);
        })
      );
    })
  );
};

export default [apiEpic, updateEpic, moveTaskEpic];
