import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';

interface State extends Schema$Preferences {}

const initialState: State = {
  ...window.preferencesStorage.get(),
  ...(window.platform === 'darwin' ? { titleBar: 'native' } : {})
};

export function preferencesReducer(
  state = initialState,
  action: PreferencesActions
): State {
  switch (action.type) {
    case PreferencesActionTypes.UPDATE_SYNC_PREFERENCES:
      return {
        ...state,
        sync: {
          ...state.sync,
          ...action.payload
        }
      };

    case PreferencesActionTypes.UPDATE_TITLE_BAR:
      return {
        ...state,
        titleBar: action.payload
      };

    default:
      return state;
  }
}
