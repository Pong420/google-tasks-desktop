import Store from 'electron-store';
import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import { SyncPreferences } from '../../typings';

const store = new Store();

export interface PreferencesState {
  sync: SyncPreferences;
}

enum KEYS {
  SYNC = 'STORAGE_SYNC'
}

const initialState: PreferencesState = {
  sync: store.get(KEYS.SYNC) || {
    enabled: true,
    reconnection: true,
    inactiveHours: 12
  }
};

export default function(
  state = initialState,
  action: PreferencesActions
): PreferencesState {
  switch (action.type) {
    case PreferencesActionTypes.UPDATE_SYNC_PREFERENCES:
      const sync = {
        ...state.sync,
        ...action.payload
      };

      store.set(KEYS.SYNC, sync);

      return {
        ...state,
        sync
      };

    default:
      return state;
  }
}
