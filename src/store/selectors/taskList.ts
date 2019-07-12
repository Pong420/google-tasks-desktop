import { createSelector } from 'reselect';
import { RootState } from '../reducers';

const idSelector = (state: RootState) => state.taskList.id;
const idsSelector = (state: RootState) => state.taskList.ids;
const byIdsSelector = (state: RootState) => state.taskList.byIds;

export const currentTaskListIdSelector = createSelector(
  idsSelector,
  idSelector,
  (ids, id) => id || ids[0]
);

export const currentTaskListSelector = createSelector(
  byIdsSelector,
  currentTaskListIdSelector,
  (byIds, id) => (id ? byIds[id] : undefined)
);

export const isMasterTaskList = createSelector(
  idsSelector,
  currentTaskListIdSelector,
  (ids, id) => ids[0] === id
);
