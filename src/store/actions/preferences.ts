export enum PreferencesActionTypes {
  TOGGLE_SYNC = 'TOGGLE_SYNC',
  INACTIVE_HOURS = 'INACTIVE_HOURS'
}

export interface ToggleSync {
  type: PreferencesActionTypes.TOGGLE_SYNC;
  payload?: boolean;
}

export interface SetInactiveHours {
  type: PreferencesActionTypes.INACTIVE_HOURS;
  payload: number;
}

export type PreferencesActions = ToggleSync | SetInactiveHours;

export const PreferencesActionCreators = {
  toggleSync(payload?: boolean): ToggleSync {
    return {
      type: PreferencesActionTypes.TOGGLE_SYNC,
      payload
    };
  },
  setInactiveHour(payload: number): SetInactiveHours {
    return {
      type: PreferencesActionTypes.INACTIVE_HOURS,
      payload
    };
  }
};
