import { from, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { AuthActions, AuthActionTypes, GetToken } from '../actions/auth';
import { authenticateAPI, getTokenAPI } from '../../api';

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

export default [authEpic, getTokenEpic];
