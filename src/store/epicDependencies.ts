import { push, RouterAction } from 'connected-react-router';
import { generatePath } from 'react-router-dom';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Action } from 'redux';
import { ofType, StateObservable } from 'redux-observable';
import { NetworkActionTypes } from './actions/network';
import { RootState } from './reducers';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  parent: '#root',
  showSpinner: false,
  trickleSpeed: 75,
  easing: 'ease'
});

function withNetworkHelper<T extends Action>(
  state$: StateObservable<RootState>
) {
  return (action$: Observable<T>) =>
    action$.pipe(
      mergeMap(action => {
        if (state$.value.network.isOnline) {
          return of(action);
        }

        return action$.pipe(
          ofType(NetworkActionTypes.ONLINE),
          mergeMap(() => of(action))
        );
      })
    );
}

const epicDependencies = {
  push: (...args: Parameters<typeof generatePath>) =>
    of<RouterAction>(push(generatePath(...args))),
  nprogress: NProgress,
  withNetworkHelper
};

export type EpicDependencies = typeof epicDependencies;

export default epicDependencies;
