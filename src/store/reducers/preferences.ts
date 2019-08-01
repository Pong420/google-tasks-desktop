import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import { SyncPreferences } from '../../typings';
import { STORAGE_DIRECTORY } from '../../constants';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

interface State {
  sync: SyncPreferences;
}

const adapter = new FileSync<State>(`${STORAGE_DIRECTORY}/preferences.json`);
const db = low(adapter);

db.defaults({
  sync: {
    enabled: true,
    reconnection: true,
    inactiveHours: 12
  }
}).write();

const initialState: State = {
  sync: db.get('sync').value()
};

export default function(
  state = initialState,
  action: PreferencesActions
): State {
  switch (action.type) {
    case PreferencesActionTypes.UPDATE_SYNC_PREFERENCES:
      const sync = {
        ...state.sync,
        ...action.payload
      };

      db.set('sync', sync).write();

      return {
        ...state,
        sync
      };

    default:
      return state;
  }
}
