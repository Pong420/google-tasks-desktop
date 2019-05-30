import { SyncPreferences } from '../../typings';

export enum PreferencesActionTypes {
  UPDATE_SYNC_PREFERENCES = 'UPDATE_SYNC_PREFERENCES'
}

export interface UpdateSyncPreferences {
  type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES;
  payload: Partial<SyncPreferences>;
}

export type PreferencesActions = UpdateSyncPreferences;

export const PreferencesActionCreators = {
  toggleSync(enabled: boolean): UpdateSyncPreferences {
    return {
      type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
      payload: {
        enabled
      }
    };
  },
  setInactiveHour(inactiveHours: number): UpdateSyncPreferences {
    return {
      type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
      payload: {
        inactiveHours
      }
    };
  },
  toggleSyncOnReconnection(enabled: boolean): UpdateSyncPreferences {
    return {
      type: PreferencesActionTypes.UPDATE_SYNC_PREFERENCES,
      payload: {
        reconnection: enabled
      }
    };
  }
};
