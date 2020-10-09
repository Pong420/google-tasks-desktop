import { RootState } from '../reducers';

export const preferencesSelector = (state: RootState) => state.preferences;

export const titleBarSelector = (state: RootState) =>
  state.preferences.titleBar;
