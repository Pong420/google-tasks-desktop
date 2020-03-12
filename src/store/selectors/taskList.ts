import { RootState } from '../reducers';
import { Schema$TaskList } from '../../typings';
import { matchPath } from 'react-router-dom';
import { PATHS } from '../../constants';

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
