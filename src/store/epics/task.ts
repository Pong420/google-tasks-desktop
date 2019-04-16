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
  takeWhile,
  switchMap,
  delay,
  switchAll,
  findIndex,
  pairwise,
  take,
  first,
  combineLatest
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
import merge from 'lodash/merge';
import { Schema$Task } from '../../typings';

const deleteTaskSuccess$ = (tasklist: string, task?: string) =>
  from(tasksAPI.delete({ tasklist, task })).pipe(
    map<any, TaskActions>(() => ({
      type: TaskActionTypes.DELETE_TASK_SUCCESS
    }))
  );

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
          return from(tasksAPI.insert(action.payload.params)).pipe(
            delay(1000),
            map(({ data }) => data),
            map<tasks_v1.Schema$Task, TaskActions>(task => ({
              type: TaskActionTypes.ADD_TASK_SUCCESS,
              payload: {
                task,
                uuid: action.payload.uuid
              }
            }))
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload.task) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success =>
                  success.payload.uuid === action.payload.requestBody.uuid
              ),
              mergeMap(success =>
                deleteTaskSuccess$(
                  action.payload.tasklist,
                  success.payload.task.id!
                )
              )
            );
          }

          return deleteTaskSuccess$(
            action.payload.tasklist,
            action.payload.task
          );

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
  const updateTaskSuccess$ = (params: UpdateTask['payload']) => {
    delete params.requestBody.completed;

    return from(tasksAPI.update(params)).pipe(
      map(({ data }) => data),
      map<tasks_v1.Schema$Task, UpdateTaskSuccess>(payload => ({
        type: TaskActionTypes.UPDATE_TASK_SUCCESS,
        payload
      }))
    );
  };

  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    groupBy(action => action.payload.requestBody.uuid),
    mergeMap(group$ => {
      return group$.pipe(
        debounce(action => timer(action.payload.task ? 1000 : 0)),
        switchMap(action => {
          // FIXME: make this better
          if (
            !state$.value.task.tasks.find(
              task => task.uuid === action.payload.requestBody.uuid
            )
          ) {
            return empty();
          }

          if (action.payload.task === undefined) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              filter(
                success =>
                  success.payload.uuid === action.payload.requestBody.uuid
              ),
              mergeMap(success => {
                return updateTaskSuccess$({
                  tasklist: action.payload.tasklist,
                  task: success.payload.task.id,
                  requestBody: merge(
                    success.payload.task,
                    action.payload.requestBody
                  )
                });
              })
            );
          }

          return updateTaskSuccess$(action.payload);
        })
      );
    })
  );
};

const sortTaskEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const tasklistId$ = state$.pipe(
    map(({ taskList }) => taskList.currentTaskListId)
  );

  const todoTasks$ = state$.pipe(map(({ task }) => task.todoTasks));

  const request$ = (task: Schema$Task) =>
    todoTasks$.pipe(
      mergeMap(todoTasks => from([undefined, ...todoTasks])),
      pairwise(),
      filter(([_, b]) => !!b && b.uuid === task.uuid),
      tap(arg => arg),
      combineLatest(tasklistId$),
      switchMap(([[previous, target], tasklist]) =>
        from(
          tasksAPI.move({
            tasklist,
            task: target!.id,
            previous: previous && previous.id
          })
        )
      ),
      map<any, SortTasksSuccess>(() => ({
        type: TaskActionTypes.SORT_TASKS_SUCCESS
      })),
      take(1)
    );

  return action$.pipe(
    ofType<TaskActions, SortTasks>(TaskActionTypes.SORT_TASKS),
    combineLatest(todoTasks$),
    groupBy(([action, todoTasks]) => todoTasks[action.payload.oldIndex].id),
    mergeMap(group$ => {
      return group$.pipe(
        switchMap(([action, todoTasks]) => {
          const target = todoTasks[action.payload.newIndex];

          if (!target.id) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              filter(success => success.payload.uuid === target.uuid),
              mergeMap(success =>
                request$({
                  ...success.payload.task,
                  uuid: success.payload.uuid
                })
              ),
              take(1)
            );
          }

          return request$(target);
        })
      );
    })
  );
};

export default [apiEpic, updateEpic, sortTaskEpic];
