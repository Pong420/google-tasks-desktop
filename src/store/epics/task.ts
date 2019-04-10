import { empty, from } from 'rxjs';
import { mergeMap, map, mapTo, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { TaskActions, TaskActionTypes } from '../actions/task';
import { RootState } from '../reducers';
import { taskApi } from '../../api';
import { tasks_v1 } from 'googleapis';

const apiEpic: Epic<TaskActions, TaskActions, RootState> = (action$, state$) =>
  action$.pipe(
    ofType<TaskActions, TaskActions>(...Object.values(TaskActionTypes)),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          return from(
            taskApi.tasks.list(action.payload).then(({ data }) => data)
          ).pipe(
            map<tasks_v1.Schema$Tasks, TaskActions>(({ items }) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload: items || []
            }))
          );

        default:
          return empty();
      }
    })
  );

export default [apiEpic];
