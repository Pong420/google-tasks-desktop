import { createSelector } from 'reselect';
import { RootState } from '../reducers';

const taskListsSelector = (state: RootState) => state.taskList;

export const currentTaskListIdSelector = (state: RootState) =>
  state.taskList.id || state.taskList.ids[0];

export const currentTaskListSelector = createSelector(
  taskListsSelector,
  currentTaskListIdSelector,
  ({ byIds }, id) => (id ? byIds[id] : null)
);
