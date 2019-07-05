import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const taskListsSelector = (state: RootState) =>
  state.taskList.ids.map(id => state.taskList.byIds[id]);

export const currentTaskListIdSelector = (state: RootState) =>
  state.taskList.id || state.taskList.ids[0];

export const currentTaskListSelector = createSelector(
  state => state,
  currentTaskListIdSelector,
  (state, id) => (id ? state.taskList.byIds[id] : null)
);
