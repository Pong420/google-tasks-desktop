import { empty, from, merge, of } from 'rxjs';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { tasks_v1 } from 'googleapis';
import {
  TaskListActions,
  TaskListActionTypes,
  NewTaskListSuccess
} from '../actions/taskList';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';
import { taskListAPI } from '../../api';
import { PATHS } from '../../constants';
import { RouterAction } from 'connected-react-router';

type TaskListEpic<T extends Action> = Epic<T, T, RootState, EpicDependencies>;

const apiEpic: TaskListEpic<TaskListActions | RouterAction> = (
  action$,
  state$,
  { nprogress, push, withOfflineHelper }
) =>
  action$.pipe(
    withOfflineHelper(state$),
    mergeMap(action => {
      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          nprogress.start();

          return from(taskListAPI.list()).pipe(
            map(({ data }) => data.items),
            map<tasks_v1.Schema$TaskLists['items'], TaskListActions>(
              (payload = []) => ({
                type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
                payload
              })
            )
          );

        case TaskListActionTypes.NEW_TASK_LIST:
          nprogress.inc(0.25);

          return from(taskListAPI.insert(action.payload)).pipe(
            map(({ data }) => data),
            switchMap(payload =>
              merge(
                of<NewTaskListSuccess>({
                  type: TaskListActionTypes.NEW_TASK_LIST_SUCCESS,
                  payload
                }),
                push(PATHS.TASKLIST, { taskListId: payload.id })
              )
            )
          );

        case TaskListActionTypes.DELETE_TASK_LIST:
          return (() => {
            const tasklist = action.payload || state$.value.taskList.id;
            return from(taskListAPI.delete({ tasklist })).pipe(
              switchMap(() =>
                merge(
                  of<TaskListActions>({
                    type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS
                  }),
                  push(PATHS.TASKLIST)
                )
              )
            );
          })();

        case TaskListActionTypes.UPDATE_TASK_LIST:
          return from(taskListAPI.patch(action.payload)).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$TaskList, TaskListActions>(payload => ({
              type: TaskListActionTypes.UPDATE_TASK_LIST_SUCCESS,
              payload
            }))
          );

        default:
          return empty();
      }
    })
  );

export default [apiEpic];
