import fs from 'fs';
import { AuthActions, AuthActionTypes } from '../actions/auth';
import { TOKEN_PATH } from '../../constants';

export interface AuthsState {
  autoLogin: boolean;
  waiting: boolean;
  loggedIn: boolean;
}

const initialState: AuthsState = {
  autoLogin: fs.existsSync(TOKEN_PATH),
  waiting: false,
  loggedIn: false
};

export default function(state = initialState, action: AuthActions): AuthsState {
  switch (action.type) {
    case AuthActionTypes.AUTHENTICATE:
      return {
        ...state,
        waiting: true
      };

    case AuthActionTypes.AUTHENTICATION_SUCCESS:
      return {
        ...state,
        waiting: false,
        loggedIn: true
      };

    case AuthActionTypes.AUTHENTICATION_FAILURE:
      return {
        ...state,
        waiting: false
      };

    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        autoLogin: false,
        loggedIn: false
      };

    default:
      return state;
  }
}
