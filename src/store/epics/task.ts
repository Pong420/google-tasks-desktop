import { empty, from } from 'rxjs';
import { mergeMap, map, takeUntil, filter, debounceTime } from 'rxjs/operators';
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
import { Schema$Task } from '../../typings';

const deleteTaskSuccess$ = (tasklist: string, task: string) =>
  from(taskApi.tasks.delete({ tasklist, task })).pipe(
    map<any, TaskActions>(() => ({
      type: TaskActionTypes.DELETE_TASK_SUCCESS
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
            taskApi.tasks.insert(action.payload).then(({ data }) => data)
          ).pipe(
            map<tasks_v1.Schema$Task, TaskActions>(payload => ({
              type: TaskActionTypes.ADD_TASK_SUCCESS,
              payload
            }))
          );

        case TaskActionTypes.DELETE_TASK:
          if (action.payload.local) {
            return action$.pipe(
              ofType<TaskActions, AddTaskSuccess>(
                TaskActionTypes.ADD_TASK_SUCCESS
              ),
              mergeMap(success =>
                deleteTaskSuccess$(
                  action.payload.taskListId,
                  success.payload.id!
                )
              )
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
) =>
  action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    debounceTime(250),
    mergeMap(action =>
      from(taskApi.tasks.update(action.payload).then(({ data }) => data)).pipe(
        map<Schema$Task, UpdateTaskSuccess>(payload => ({
          type: TaskActionTypes.UPDATE_TASK_SUCCESS,
          payload
        }))
      )
    )
  );

export default [apiEpic, updateEpic];
