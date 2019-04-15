import { empty, from, forkJoin, timer, of } from 'rxjs';
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
  switchMap
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
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
            action.payload.task!
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

          if (!action.payload.task) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              takeWhile(
                success =>
                  success.payload.uuid === action.payload.requestBody.uuid
              ),
              mergeMap(success => {
                return updateTaskSuccess$({
                  tasklist: action.payload.tasklist,
                  task: success.payload.task.id,
                  requestBody: {
                    ...success.payload.task,
                    ...action.payload.requestBody,
                    id: success.payload.task.id
                  }
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

export default [apiEpic, updateEpic];
