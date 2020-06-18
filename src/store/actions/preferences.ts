import { UnionCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { SyncPreferences } from '../../typings';

export enum PreferencesActionTypes {
  UPDATE_SYNC_PREFERENCES = 'UPDATE_SYNC_PREFERENCES'
}

export interface UpdateSyncPreferences {
  type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES;
  payload: Partial<SyncPreferences>;
}

export type PreferencesActions = UpdateSyncPreferences;

function toggleSync(enabled: boolean): UpdateSyncPreferences {
  return {
    type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
    payload: {
      enabled
    }
  };
}

function setInactiveHour(inactiveHours: number): UpdateSyncPreferences {
  return {
    type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
    payload: {
      inactiveHours
    }
  };
}

function toggleSyncOnReconnection(enabled: boolean): UpdateSyncPreferences {
  return {
    type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
    payload: {
      reconnection: enabled
    }
  };
}

export const preferenceActions = {
  toggleSync,
  setInactiveHour,
  toggleSyncOnReconnection
};

export type PreferenceActions = UnionCRUDActions<typeof preferenceActions>;

export const usePreferenceActions = () => useActions(preferenceActions);
