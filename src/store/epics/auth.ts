import fs from 'fs';
import { from, of, empty, merge } from 'rxjs';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { RouterAction } from 'connected-react-router';
import { AuthActions, AuthActionTypes, GetToken } from '../actions/auth';
import { authenticateAPI, getTokenAPI } from '../../api';
import { TOKEN_PATH } from '../../constants';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';

type Actions = AuthActions | RouterAction;
type AuthEpic = Epic<Actions, Actions, RootState, EpicDependencies>;

const authEpic: AuthEpic = (action$, _, { push }) =>
  action$.pipe(
    ofType<Actions>(AuthActionTypes.AUTHENTICATE),
    switchMap(() =>
      from(authenticateAPI()).pipe(
        mergeMap(() =>
          merge(
            of<Actions>({
              type: AuthActionTypes.AUTHENTICATION_SUCCESS
            })
          )
        ),
        catchError(() =>
          of<Actions>({
            type: AuthActionTypes.AUTHENTICATION_FAILURE
          })
        )
        // TODO: takeUntil
      )
    )
  );

const getTokenEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType<Actions, GetToken>(AuthActionTypes.GET_TOKEN),
    switchMap(action =>
      from(getTokenAPI(action.payload)).pipe(
        mergeMap(() =>
          of<Actions>({
            type: AuthActionTypes.AUTHENTICATION_SUCCESS
          })
        ),
        catchError(() =>
          of<Actions>({
            type: AuthActionTypes.GET_TOKEN_FAILURE
          })
        )
        // TODO: takeUntil
      )
    )
  );

const logoutEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType<Actions>(AuthActionTypes.LOGOUT),
    switchMap(() => {
      try {
        fs.unlinkSync(TOKEN_PATH);
      } catch (err) {}

      return empty();
    })
  );

export default [authEpic, getTokenEpic, logoutEpic];
