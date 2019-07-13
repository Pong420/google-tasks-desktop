import { push, RouterAction } from 'connected-react-router';
import { generatePath } from 'react-router-dom';
import { of, Observable } from 'rxjs';
import { delayWhen, mergeMap } from 'rxjs/operators';
import { Action } from 'redux';
import { ofType, StateObservable } from 'redux-observable';
import { NetworkActionTypes, NetworkActions } from './actions';
import { RootState } from './reducers';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  parent: '#root',
  showSpinner: false,
  trickleSpeed: 75,
  easing: 'ease'
});

function withOfflineHelper<T extends Action>(
  state$: StateObservable<RootState>
) {
  return (action$: Observable<T>) => {
    return action$.pipe(
      mergeMap(action => {
        return state$.value.network.isOnline
          ? of(action)
          : of(action).pipe(
              delayWhen(() =>
                action$.pipe(ofType<NetworkActions>(NetworkActionTypes.ONLINE))
              )
            );
      })
    );
  };
}

const epicDependencies = {
  push: (...args: Parameters<typeof generatePath>) =>
    of<RouterAction>(push(generatePath(...args))),
  nprogress: NProgress,
  withOfflineHelper
};

export type EpicDependencies = typeof epicDependencies;

export default epicDependencies;
