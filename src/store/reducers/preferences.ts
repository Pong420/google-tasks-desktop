import Store from 'electron-store';
import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import { SyncPreferences } from '../../typings';

export interface PreferencesState {
  sync: SyncPreferences;
}

const store = new Store<SyncPreferences>();
const KEY = 'SYNC';

const initialState: PreferencesState = {
  sync: store.get(KEY, {
    enabled: true,
    reconnection: true,
    inactiveHours: 12
  })
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

      store.set(KEY, sync);

      return {
        ...state,
        sync
      };

    default:
      return state;
  }
}
