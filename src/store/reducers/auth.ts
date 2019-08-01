import { AuthActions, AuthActionTypes } from '../actions/auth';
import { tokenStorage } from '../../storage';

export interface AuthsState {
  autoLogin: boolean;
  loggedIn: boolean;
}

const initialState: AuthsState = {
  autoLogin: !tokenStorage.isEmpty().value(),
  loggedIn: false
};

export default function(state = initialState, action: AuthActions): AuthsState {
  switch (action.type) {
    case AuthActionTypes.AUTHENTICATE:
      return {
        ...state
      };

    case AuthActionTypes.AUTHENTICATION_SUCCESS:
      return {
        ...state,
        loggedIn: true
      };

    case AuthActionTypes.AUTHENTICATION_FAILURE:
      return {
        ...state
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
