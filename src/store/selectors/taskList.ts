import { RootState } from '../reducers';
import { Schema$TaskList } from '../../typings';

export const taskListIdsSelector = (state: RootState) => state.taskList.ids;

export const taskListsSelector = (id: string) => (state: RootState) =>
  state.taskList.byIds[id];

export const currentTaskListsSelector = (id?: string) => (state: RootState) => {
  return id
    ? state.taskList.byIds[id]
    : (state.taskList.list[0] as Schema$TaskList);
};
