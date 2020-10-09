import { useActions } from '../../hooks/useActions';
import { DeepPartial } from '../../utils/form';

function updatePreferences(payload: DeepPartial<Schema$Preferences>) {
  return {
    type: 'UPDATE_PREFERENCES' as const,
    payload
  };
}

export type UpdatePreferences = ReturnType<typeof updatePreferences>;
export type PreferenceActions = UpdatePreferences;

export const preferenceActions = {
  updatePreferences
};

export const usePreferenceActions = () => useActions(preferenceActions);
