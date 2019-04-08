import { AuthActions, AuthActionTypes } from '../actions/auth';

// TODO:
export interface AuthsState {
  waiting: boolean;
  authorized: boolean;
  needToken: boolean;
}

const initialState: AuthsState = {
  waiting: false,
  authorized: false,
  needToken: false
};

export default function(state = initialState, action: AuthActions) {
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
        authorized: true
      };

    case AuthActionTypes.AUTHENTICATION_FAILURE:
      return {
        ...state,
        waiting: false,
        authorized: false
      };

    default:
      return state;
  }
}
