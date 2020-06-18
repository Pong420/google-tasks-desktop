import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import { SyncPreferences } from '../../typings';

interface State {
  sync: SyncPreferences;
}

const initialState: State = {
  sync: window.preferencesStorage.get()
};

export function preferencesReducer(
  state = initialState,
  action: PreferencesActions
): State {
  switch (action.type) {
    case PreferencesActionTypes.UPDATE_SYNC_PREFERENCES:
      const sync = {
        ...state.sync,
        ...action.payload
      };

      window.preferencesStorage.save(sync);

      return {
        ...state,
        sync
      };

    default:
      return state;
  }
}
