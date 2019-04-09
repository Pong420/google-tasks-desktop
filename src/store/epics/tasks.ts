import { empty, of, from } from 'rxjs';
import { switchMap, mergeMap, map, mapTo } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { TaskActions, TaskActionTypes } from '../actions/task';
import { RootState } from '../reducers';
import { saveTaskLists } from '../../utils/storage';
import { taskApi } from '../../api';

const saveTasksListEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskActions, TaskActions>(...Object.values(TaskActionTypes)),
    // TODO: debounce ?
    switchMap(() => {
      saveTaskLists(state$.value.task.taskLists);
      return empty();
    })
  );

const apiEpic: Epic<TaskActions, TaskActions, RootState> = (action$, state$) =>
  action$.pipe(
    ofType<TaskActions, TaskActions>(...Object.values(TaskActionTypes)),
    mergeMap(action => {
      // const { payload } = action;

      switch (action.type) {
      //   case TaskActionTypes.ADD_TASK:
      //     return from(
      //       taskApi.tasks.insert({
      //         tasklist: 'MDI1OTE4NDQzMzEwNzk5NjIyMDM6MDow',
      //         requestBody: {
      //           title: action.payload.title
      //         }
      //       })
      //     ).pipe(
      //       map<any, TaskActions>(() => ({
      //         type: TaskActionTypes.ADD_TASK_SUCCESS,
      //         payload
      //       }))
      //     );

      //   case TaskActionTypes.UPDATE_TASK:
      //     return of<TaskActions>({
      //       type: TaskActionTypes.UPDATE_TASK_SUCCESS,
      //       payload
      //     });

      //   case TaskActionTypes.DELETE_TASK:
      //     return of<TaskActions>({
      //       type: TaskActionTypes.DELETE_TASK_SUCCESS,
      //       payload
      //     });

      //   case TaskActionTypes.TOGGLE_COMPLETE:
      //     return of<TaskActions>({
      //       type: TaskActionTypes.TOGGLE_COMPLETE_SUCCESS,
      //       payload
      //     });

        default:
          return empty();
      }
    })
  );

export default [saveTasksListEpic, apiEpic];
