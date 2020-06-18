import { RootState } from '../reducers';
import { createSelector } from 'reselect';
import { Schema$Task } from '../../typings';

export const todoTaskIdsSelector = (state: RootState) => state.task.todo.ids;

export const completedTaskIdsSelector = (state: RootState) =>
  state.task.completed.ids;

export const taskSelector = (id: string) => (state: Pick<RootState, 'task'>) =>
  state.task.todo.byIds[id] || state.task.completed.byIds[id];

export const todoTaskSelector = (id: string) => (state: RootState) =>
  state.task.todo.byIds[id];

export const completedTaskSelector = (id: string) => (state: RootState) =>
  state.task.completed.byIds[id];

export const focusedSelector = (id: string) => (state: RootState) =>
  state.task.focused === id;

const future = new Date(10 ** 15).getTime();
const getDate = (t?: Schema$Task) =>
  t && t.due ? new Date(t.due).getTime() : future;

const getDateLabel = (due: string | null | undefined, now: Date) => {
  let label = 'No date';
  if (due) {
    const date = new Date(due);
    const dayDiff = date.dayDiff(now);
    if (dayDiff > 0) {
      label = 'Past';
    } else if (dayDiff === 0) {
      label = 'Today';
    } else if (dayDiff === -1) {
      label = 'Tomorrow';
    } else if (dayDiff < -1) {
      label = 'Due ' + date.format('D, j M');
    }
  }

  return label;
};

export const todoTasksIdsByDateSelector = createSelector(
  todoTaskIdsSelector,
  (state: RootState) => state.task.todo.byIds,
  (ids, byIds) => {
    const now = new Date();
    const map = ids
      .sort((a, b) => getDate(byIds[a]) - getDate(byIds[b]))
      .reduce((result, uuid) => {
        const { due } = byIds[uuid] || {};
        const label = getDateLabel(due, now);
        return { ...result, [label]: [...(result[label] || []), uuid] };
      }, {} as Record<string, string[]>);
    return Object.entries(map);
  }
);
