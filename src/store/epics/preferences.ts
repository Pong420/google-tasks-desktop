import { Epic, ofType } from 'redux-observable';
import { defer, empty, fromEvent, merge, timer, of, concat } from 'rxjs';
import { switchMap, map, takeUntil, filter, delay } from 'rxjs/operators';
import {
  TaskListActions,
  TaskListActionTypes,
  syncTaskList
} from '../actions/taskList';
import { TaskActions, TaskActionTypes, syncTasks } from '../actions/task';
import { RootState } from '../reducers';
import { getAllTasklist, getAllTasks } from '../../service';
import { currentTaskListsSelector } from '../selectors';
import { PreferenceActions } from '../actions';

type Actions = TaskListActions | TaskActions | PreferenceActions;
type PreferencesEpic = Epic<Actions, Actions, RootState>;

export const syncDataEpic: PreferencesEpic = (action$, state$) => {
  const userActions$ = action$.pipe(
    filter(
      ({ type }) =>
        type !== TaskListActionTypes.SYNC && type !== TaskActionTypes.SYNC
    )
  );

  const inactive$ = userActions$.pipe(
    switchMap(() => {
      const { inactiveHours } = state$.value.preferences.sync;
      const ms = inactiveHours * 60 * 60 * 1000;
      return timer(Math.max(ms, 60 * 1000));
    })
  );

  const reconnect$ = fromEvent(window, 'online').pipe(
    map(() => (state$.value.preferences.sync.reconnection ? empty() : of([])))
  );

  return merge(reconnect$, inactive$).pipe(
    switchMap(() => {
      const { enabled } = state$.value.preferences.sync;
      return enabled
        ? concat(
            defer(() => getAllTasklist()).pipe(map(syncTaskList)),
            defer(() => {
              const taskList = currentTaskListsSelector(state$.value);
              return taskList
                ? getAllTasks({ tasklist: taskList.id })
                : Promise.reject(new Error('Sync tasks failed'));
            }).pipe(
              delay(100),
              map(syncTasks)
              //
            )
          ).pipe(takeUntil(userActions$))
        : empty();
    })
  );
};

export const savePreferencesEpic: PreferencesEpic = (action$, state$) => {
  return action$.pipe(
    ofType<Actions, PreferenceActions>('UPDATE_PREFERENCES'),
    switchMap(({ payload: changes }) => {
      window.preferencesStorage.save(state$.value.preferences);

      if (changes.theme) {
        window.__setTheme(changes.theme);
      }

      if (changes.accentColor) {
        window.__setAccentColor(changes.accentColor);
      }

      if (changes.titleBar) {
        window.__setTitleBar(changes.titleBar);
      }

      return empty();
    })
  );
};

export default [syncDataEpic, savePreferencesEpic];
