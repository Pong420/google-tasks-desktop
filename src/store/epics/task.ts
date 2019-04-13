import { empty, from } from 'rxjs';
import { mergeMap, map, takeUntil, filter, take } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import {
  TaskActions,
  TaskActionTypes,
  AddTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { taskApi } from '../../api';
import { tasks_v1 } from 'googleapis';

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

const apiEpic: Epic<TaskActions, TaskActions, RootState> = (action$, state$) =>
  action$.pipe(
    filter(action => !/Update/i.test(action.type)),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          return from(
            taskApi.tasks
              .list({
                ...action.payload,
                showCompleted: true,
                showHidden: true
              })
              .then(({ data }) => data)
          ).pipe(
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

        default:
          return empty();
      }
    })
  );

const updateEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    mergeMap(action => {
      if (!action.payload.task) {
        return action$.pipe(
          ofType<TaskActions, AddTaskSuccess>(TaskActionTypes.ADD_TASK_SUCCESS),
          mergeMap(success =>
            updateTaskSuccess$({
              tasklist: action.payload.tasklist,
              task: success.payload.task.id,
              requestBody: {
                ...success.payload.task,
                ...action.payload.requestBody,
                id: success.payload.task.id
              }
            })
          ),
          take(1)
        );
      }

      return updateTaskSuccess$(action.payload);
    })
  );
};

export default [apiEpic, updateEpic];
