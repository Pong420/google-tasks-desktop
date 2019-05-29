import {
  PreferencesActions,
  PreferencesActionTypes
} from '../actions/preferences';
import Store from 'electron-store';

const store = new Store();

export interface PreferencesState {
  sync: boolean;
  inactiveHours: number;
}

const initialState: PreferencesState = {
  sync: store.get(PreferencesActionTypes.TOGGLE_SYNC) !== false ? true : false,
  inactiveHours: store.get(PreferencesActionTypes.INACTIVE_HOURS) || 12
};

export default function(
  state = initialState,
  action: PreferencesActions
): PreferencesState {
  switch (action.type) {
    case PreferencesActionTypes.TOGGLE_SYNC:
      const sync =
        typeof action.payload === 'undefined' ? !state.sync : action.payload;

      store.set(action.type, sync);

      return {
        ...state,
        sync
      };

    case PreferencesActionTypes.INACTIVE_HOURS:
      const inactiveHours = action.payload;

      store.set(action.type, inactiveHours);

      return {
        ...state,
        inactiveHours
      };

    default:
      return state;
  }
}
