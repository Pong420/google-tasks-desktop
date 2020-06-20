import { RootState } from '../reducers';
import { createSelector } from 'reselect';
import { Schema$Task } from '../../typings';

export const todoTaskIdsSelector = (state: RootState) => state.task.todo.ids;
export const todoTaskListSelector = (state: RootState) => state.task.todo.list;
export const todoTaskByIdsSelector = (state: RootState) =>
  state.task.todo.byIds;

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

export const getDateLabel = (due: string | null | undefined, now: Date) => {
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
  todoTaskByIdsSelector,
  (ids, byIds) => {
    const order = ids
      .slice()
      .sort((a, b) => getDate(byIds[a]) - getDate(byIds[b]));
    const map = order.reduce((result, id) => {
      const task = byIds[id];
      if (task) {
        const label = getDateLabel(task.due, new Date());
        return { ...result, [label]: [...(result[label] || []), task] };
      }
      return result;
    }, {} as Record<string, Schema$Task[]>);
    return { order, tasks: Object.entries(map) };
  }
);
