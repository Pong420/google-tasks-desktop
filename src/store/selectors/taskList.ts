import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';
import { Schema$TaskList } from '../../typings';

export const taskListIdsSelector = (state: RootState) => state.taskList.ids;

export const taskListsSelector = (id: string) => (state: RootState) =>
  state.taskList.byIds[id];

export const currentTaskListsSelector = (state: RootState) => {
  const matches = matchPath<{ taskListId: string }>(
    state.router.location.pathname,
    {
      path: PATHS.TASKLIST,
      exact: true
    }
  );
  const id = matches && matches.params.taskListId;
  return id
    ? state.taskList.byIds[id]
    : (state.taskList.list[0] as Schema$TaskList);
};

export const isMasterTaskListSelector = createSelector(
  taskListIdsSelector,
  currentTaskListsSelector,
  (ids, list) => list && list.id === ids[0]
);

export const isSortByDateSelector = (id: string) => (state: RootState) =>
  state.taskList.sortByDate.includes(id);
