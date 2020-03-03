import { generatePath } from 'react-router-dom';
import { ofType, Epic } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import { of, empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthActions } from '../actions/auth';
import { authenticate } from '../../service';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';

type Actions = AuthActions | RouterAction;
type AuthEpic = Epic<Actions, Actions, RootState>;

const authEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType('AUTHENTICATED'),
    switchMap(() => {
      authenticate();
      return of(replace(generatePath(PATHS.TASKLIST, {})));
    })
  );

const logoutEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType('LOGOUT'),
    switchMap(() => {
      try {
        // TODO:
        // fs.unlinkSync(TOKEN_PATH);
      } catch (err) {}
      return empty();
    })
  );

export default [authEpic, logoutEpic];
