import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const currentTaskListIdSelector = (state: RootState) =>
  state.taskList.id || state.taskList.ids[0];

export const currentTaskListSelector = createSelector(
  state => state,
  currentTaskListIdSelector,
  (state, id) => (id ? state.taskList.byIds[id] : undefined)
);

export const isMasterTaskList = createSelector(
  state => state,
  currentTaskListIdSelector,
  (state, id) => state.taskList.ids[0] === id
);
