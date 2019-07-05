import { empty, from } from 'rxjs';
import { filter, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import { TaskActions, TaskActionTypes } from '../actions/task';
import { RootState } from '../reducers';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';

type Actions = TaskActions;
type TaskEpic = Epic<Actions, Actions, RootState, EpicDependencies>;

const getAllTasks$ = (tasklist: string) =>
  from(
    tasksAPI.list({
      tasklist,
      showCompleted: true,
      showHidden: false
    })
  ).pipe(map(({ data }) => data.items));

const apiEpic: TaskEpic = (action$, state$, { nprogress }) => {
  return action$.pipe(
    filter(action => !/Update|Move|New/i.test(action.type)),
    mergeMap(action => {
      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return getAllTasks$(action.payload).pipe(
            tap(() => nprogress.done()),
            map<tasks_v1.Schema$Tasks['items'], Actions>((payload = []) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload
            })),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        default:
          return empty();
      }
    })
  );
};

export default [apiEpic];
