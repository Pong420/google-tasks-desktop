import { AuthActions } from '../actions/auth';

interface State {
  loggedIn: boolean;
}

const initialState: State = {
  loggedIn: !!window.tokenStorage.get()
};

export default function (state = initialState, action: AuthActions): State {
  switch (action.type) {
    case 'AUTHENTICATED':
      return {
        ...state,
        loggedIn: true
      };

    case 'LOGOUT':
      return {
        ...state,
        loggedIn: false
      };

    default:
      return state;
  }
}
