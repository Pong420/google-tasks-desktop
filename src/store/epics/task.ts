import { empty, from, forkJoin, timer } from 'rxjs';
import {
  mergeMap,
  map,
  takeUntil,
  filter,
  take,
  mapTo,
  tap,
  debounce,
  debounceTime,
  pluck,
  distinctUntilChanged,
  exhaustMap,
  concatMap,
  switchMap
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import isEqual from 'lodash/fp/isEqual';
import {
  TaskActions,
  TaskActionTypes,
  AddTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { taskApi } from '../../api';
import { EpicDependencies } from '../epicDependencies';

const deleteTaskSuccess$ = (tasklist: string, task: string) =>
  from(taskApi.tasks.delete({ tasklist, task })).pipe(
    map<any, TaskActions>(() => ({
      type: TaskActionTypes.DELETE_TASK_SUCCESS
    }))
  );

const updateTaskSuccess$ = (params: tasks_v1.Params$Resource$Tasks$Update) =>
  from(taskApi.tasks.update(params).then(({ data }) => data)).pipe(
    map<tasks_v1.Schema$Task, UpdateTaskSuccess>(payload => ({
      type: TaskActionTypes.UPDATE_TASK_SUCCESS,
      payload
    }))
  );

const apiEpic: Epic<TaskActions, TaskActions, RootState, EpicDependencies> = (
  action$,
  state$,
  { nprogress }
) =>
  action$.pipe(
    filter(action => !/Update/i.test(action.type)),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      const tasklist = state$.value.taskList.currentTaskListId;

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return from(
            taskApi.tasks
              .list({
                ...action.payload,
                showCompleted: true,
                showHidden: true
              })
              .then(({ data }) => data)
          ).pipe(
            tap(() => nprogress.done()),
            map<tasks_v1.Schema$Tasks, TaskActions>(({ items }) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload: items || []
            })),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.ADD_TASK:
          return from(
            taskApi.tasks.insert(action.payload.params).then(({ data }) => data)
          ).pipe(
            map<tasks_v1.Schema$Task, TaskActions>(task => ({
              type: TaskActionTypes.ADD_TASK_SUCCESS,
              payload: {
                uuid: action.payload.uuid,
                task
              }
            }))
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload.id) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              mergeMap(success =>
                deleteTaskSuccess$(
                  action.payload.taskListId,
                  success.payload.task.id!
                )
              ),
              take(1)
            );
          }

          return deleteTaskSuccess$(
            action.payload.taskListId,
            action.payload.id!
          );

        case TaskActionTypes.DELETE_COMPLETED_TASKS:
          return forkJoin(
            ...action.payload.map(task =>
              from(taskApi.tasks.delete({ tasklist, task: task.id }))
            )
          ).pipe(
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
  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    exhaustMap(action => {
      return state$.pipe(
        map(({ task }) =>
          task.tasks.find(task => task.uuid === action.payload.requestBody.uuid)
        ),
        map(task => {
          if (task) {
            return {
              id: task.id,
              title: task.title,
              status: task.status,
              uuid: task.uuid
            };
          }
          return null;
        }),
        debounceTime(1000),
        distinctUntilChanged(isEqual),
        mergeMap(data => {
          if (data && data.id) {
            return updateTaskSuccess$({
              ...action.payload,
              task: data.id,
              requestBody: {
                ...data
              }
            });
          }

          return empty();
        })
      );

      // return updateTaskSuccess$(action.payload);
    })
  );
};

export default [apiEpic, updateEpic];
