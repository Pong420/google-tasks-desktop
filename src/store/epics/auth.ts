import fs from 'fs';
import { from, of, empty } from 'rxjs';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { AuthActions, AuthActionTypes, GetToken } from '../actions/auth';
import { authenticateAPI, getTokenAPI } from '../../api';
import { TOKEN_PATH } from '../../constants';

const authEpic: Epic<AuthActions> = $action =>
  $action.pipe(
    ofType<AuthActions>(AuthActionTypes.AUTHENTICATE),
    switchMap(() =>
      from(authenticateAPI()).pipe(
        mergeMap(() =>
          of<AuthActions>({
            type: AuthActionTypes.AUTHENTICATION_SUCCESS
          })
        ),
        catchError(() =>
          of<AuthActions>({
            type: AuthActionTypes.AUTHENTICATION_FAILURE
          })
        )
        // TODO: takeUntil
      )
    )
  );

const getTokenEpic: Epic<AuthActions> = $action =>
  $action.pipe(
    ofType<AuthActions, GetToken>(AuthActionTypes.GET_TOKEN),
    switchMap(action =>
      from(getTokenAPI(action.payload)).pipe(
        mergeMap(() =>
          of<AuthActions>({
            type: AuthActionTypes.AUTHENTICATION_SUCCESS
          })
        ),
        catchError(() =>
          of<AuthActions>({
            type: AuthActionTypes.GET_TOKEN_FAILURE
          })
        )
        // TODO: takeUntil
      )
    )
  );

const logoutEpic: Epic<AuthActions> = $action =>
  $action.pipe(
    ofType<AuthActions>(AuthActionTypes.LOGOUT),
    switchMap(() => {
      try {
        fs.unlinkSync(TOKEN_PATH);
      } catch (err) {}

      return empty();
    })
  );

export default [authEpic, getTokenEpic, logoutEpic];
