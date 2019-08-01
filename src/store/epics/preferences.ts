import { empty, from, merge, interval } from 'rxjs';
import {
  map,
  switchMap,
  withLatestFrom,
  filter,
  takeUntil
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { TaskActions, TaskActionTypes } from '../actions/task';
import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { NetworkActions, NetworkActionTypes } from '../actions/network';
import { RootState } from '../reducers';
import { tasksAPI, taskListAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { tasks_v1 } from 'googleapis';

type Actions = TaskActions | TaskListActions | NetworkActions;
type PreferencesEpic = Epic<Actions, Actions, RootState, EpicDependencies>;

const syncEpic: PreferencesEpic = (action$, state$) => {
  const getAllTasksSilent$ = () => {
    const { taskList, network } = state$.value;
    return taskList.id && network.isOnline
      ? from(
          tasksAPI.list({
            tasklist: taskList.id,
            showCompleted: true,
            showHidden: false
          })
        ).pipe(
          map(({ data }) => data.items),
          map<tasks_v1.Schema$Tasks['items'], Actions>((payload = []) => ({
            type: TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS,
            payload
          }))
        )
      : empty();
  };

  const getAllTaskListsSilent$ = () => {
    return state$.value.network.isOnline
      ? from(taskListAPI.list()).pipe(
          map(({ data }) => data.items),
          map<tasks_v1.Schema$TaskLists['items'], TaskListActions>(
            (payload = []) => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SILENT_SUCCESS,
              payload
            })
          )
        )
      : empty();
  };

  const withSyncPreferences = withLatestFrom(
    state$.pipe(map(({ preferences }) => preferences.sync))
  );

  const reconnection = action$.pipe(
    ofType(NetworkActionTypes.OFFLINE),
    switchMap(() =>
      action$.pipe(
        ofType(NetworkActionTypes.ONLINE),
        withSyncPreferences,
        switchMap(([_, { reconnection }]) =>
          reconnection ? getAllTasksSilent$() : empty()
        ),
        takeUntil(action$)
      )
    )
  );

  const filterdAction$ = action$.pipe(
    filter(
      ({ type }) =>
        type !== TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS &&
        type !== TaskListActionTypes.GET_ALL_TASK_LIST_SILENT_SUCCESS
    )
  );

  return merge(
    reconnection,
    filterdAction$.pipe(
      withSyncPreferences,
      switchMap(([_, { enabled, inactiveHours }]) => {
        const ms = inactiveHours * 60 * 60 * 1000;

        if (!enabled || ms < 60 * 1000) {
          return empty();
        }

        return interval(ms).pipe(
          switchMap(() =>
            merge(getAllTasksSilent$(), getAllTaskListsSilent$())
          ),
          takeUntil(filterdAction$)
        );
      })
    )
  );
};

export default [syncEpic];
