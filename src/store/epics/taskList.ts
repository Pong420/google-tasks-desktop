import { empty, of, from } from 'rxjs';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  TaskListActions,
  TaskListActionTypes,
  SyncTaskListSuccess,
  GetAllTaskListSuccess,
  AddTaskList,
  AddTaskListSuccess
} from '../actions/taskList';
import { RootState } from '../reducers';
import { saveTaskLists } from '../../utils/storage';
import { taskApi } from '../../api';

// TODO: dependenics for api

const syncTasksListEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      TaskListActionTypes.SYNC_TASK_LIST
    ),
    switchMap(() =>
      from(taskApi.tasklists.list()).pipe(
        map(res => {
          const result: SyncTaskListSuccess = {
            type: TaskListActionTypes.SYNC_TASK_LIST_SUCCESS,
            payload: res.data.items!
          };
          return result;
        })
      )
    )
  );

const saveTasksListEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    // TODO: debounce ?
    switchMap(() => {
      saveTaskLists(state$.value.taskList.taskLists);
      return empty();
    })
  );

const apiEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          return from(taskApi.tasklists.list()).pipe(
            map(res => {
              const result: GetAllTaskListSuccess = {
                type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
                payload: res.data.items!
              };
              return result;
            })
          );

        case TaskListActionTypes.ADD_TASK_LIST:
          return from(
            taskApi.tasklists.insert({
              requestBody: action.payload
            })
          ).pipe(
            map(({ data }) => {
              const result: AddTaskListSuccess = {
                type: TaskListActionTypes.ADD_TASK_LIST_SUCCESS,
                payload: {
                  tid: action.payload.tid,
                  data
                }
              };
              return result;
            })
          );

        default:
          return empty();
      }
    })
  );

export default [syncTasksListEpic, saveTasksListEpic, apiEpic];
