import { PreferenceActions } from '../actions/preferences';

interface State extends Schema$Preferences {}

const initialState: State = {
  ...window.preferencesStorage.get(),
  ...(window.platform === 'darwin' ? { titleBar: 'native' } : {})
};

export function preferencesReducer(
  state = initialState,
  action: PreferenceActions
): State {
  switch (action.type) {
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        ...action.payload,
        sync: {
          ...state.sync,
          ...action.payload.sync
        }
      };

    default:
      return state;
  }
}
