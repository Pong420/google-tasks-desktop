import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import { SyncPreferences, TitleBar } from '../../typings';

interface State {
  sync: SyncPreferences;
  titleBar: TitleBar;
}

const initialState: State = window.preferencesStorage.get();

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
