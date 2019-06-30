import { empty, from } from 'rxjs';
import { mergeMap, map, mapTo } from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { tasks_v1 } from 'googleapis';
import { RouterAction } from 'connected-react-router';
import {
  TaskListActions,
  TaskListActionTypes,
  NewTaskListSuccess
} from '../actions/taskList';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';
import { taskListAPI } from '../../api';
import { PATHS } from '../../constants';

type TaskListEpic<T extends Action> = Epic<T, T, RootState, EpicDependencies>;

const apiEpic: TaskListEpic<TaskListActions> = (
  action$,
  state$,
  { nprogress, withNetworkHelper }
) =>
  action$.pipe(
    withNetworkHelper(state$),
    mergeMap(action => {
      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          nprogress.start();

          return from(taskListAPI.list()).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$TaskLists, TaskListActions>(({ items }) => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
              payload: items!.map(taskList => taskList)
            }))
          );

        case TaskListActionTypes.NEW_TASK_LIST:
          nprogress.inc(0.25);

          return from(taskListAPI.insert(action.payload)).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$TaskList, NewTaskListSuccess>(payload => ({
              type: TaskListActionTypes.NEW_TASK_LIST_SUCCESS,
              payload
            }))
          );

        case TaskListActionTypes.DELETE_TASK_LIST:
          return (() => {
            const { currentTaskListId } = state$.value.taskList;
            const tasklist = action.payload || currentTaskListId;
            return from(taskListAPI.delete({ tasklist })).pipe(
              mapTo<unknown, TaskListActions>({
                type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS
              })
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

const redirectEpic: TaskListEpic<TaskListActions | RouterAction> = (
  action$,
  state$,
  { push }
) =>
  action$.pipe(
    mergeMap(action => {
      let taskListId = '';
      const { currentTaskListId, taskLists } = state$.value.taskList;

      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
          if (!currentTaskListId) {
            taskListId = action.payload[0].id!;
          }
          break;

        case TaskListActionTypes.NEW_TASK_LIST_SUCCESS:
          taskListId = action.payload.id!;
          break;

        case TaskListActionTypes.DELETE_TASK_LIST:
          taskListId = taskLists[0].id!;
          break;

        default:
      }

      if (taskListId) {
        return push(PATHS.TASKLIST, {
          taskListId
        });
      }

      return empty();
    })
  );

export default [apiEpic, redirectEpic];
