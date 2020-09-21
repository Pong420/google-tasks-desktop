import { RootState } from '../reducers';

export const titleBarSelector = (state: RootState) =>
  state.preferences.titleBar;
