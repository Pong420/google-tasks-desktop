import { empty, from } from 'rxjs';
import { mergeMap, map, mapTo } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import {
  TaskListActions,
  TaskListActionTypes,
  SyncTaskListSuccess,
  AddTaskListSuccess
} from '../actions/taskList';
import { RootState } from '../reducers';
import { saveTaskLists } from '../../utils/storage';
import { taskApi } from '../../api';
import { TaskList, TaskLists } from '../../typings';
import { tasks_v1 } from 'googleapis';
import uuid from 'uuid';

// TODO: dependenics for api

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
          return from(taskApi.tasklists.list().then(({ data }) => data)).pipe(
            map<tasks_v1.Schema$TaskLists, TaskListActions>(({ items }) => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
              payload: items!.map(taskList => taskList)
            }))
          );

        case TaskListActionTypes.ADD_TASK_LIST:
          return from(
            taskApi.tasklists
              .insert({
                requestBody: {
                  title: action.payload.title
                }
              })
              .then(({ data }) => data)
          ).pipe(
            map<tasks_v1.Schema$TaskList, TaskListActions>(payload => ({
              type: TaskListActionTypes.ADD_TASK_LIST_SUCCESS,
              payload
            }))
          );

        case TaskListActionTypes.DELETE_TASK_LIST:
          return from(
            taskApi.tasklists.delete({ tasklist: action.payload })
          ).pipe(
            mapTo<any, TaskListActions>({
              type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS
            })
          );

        default:
          return empty();
      }
    })
  );

export default [apiEpic];
