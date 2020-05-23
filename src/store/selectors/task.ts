import { RootState } from '../reducers';

export const todoTaskIdsSelector = (state: RootState) => state.task.todo.ids;

export const completedTaskIdsSelector = (state: RootState) =>
  state.task.completed.ids;

export const taskSelector = (id: string) => (state: RootState) =>
  state.task.todo.byIds[id] || state.task.completed.byIds[id];

export const todoTaskSelector = (id: string) => (state: RootState) =>
  state.task.todo.byIds[id];

export const completedTaskSelector = (id: string) => (state: RootState) =>
  state.task.completed.byIds[id];

export const focusedSelector = (id: string) => (state: RootState) =>
  state.task.focused === id;
