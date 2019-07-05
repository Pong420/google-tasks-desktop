import { empty, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { tasks_v1 } from 'googleapis';
import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';
import { taskListAPI } from '../../api';

type TaskListEpic<T extends Action> = Epic<T, T, RootState, EpicDependencies>;

const apiEpic: TaskListEpic<TaskListActions> = (
  action$,
  state$,
  { nprogress }
) =>
  action$.pipe(
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

        default:
          return empty();
      }
    })
  );

export default [apiEpic];
