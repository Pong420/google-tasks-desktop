import { RootState } from '../reducers';

export const tasksSelector = (state: RootState) => (
  type: 'todo' | 'completed'
) => state.task[type].map(id => state.task.byIds[id]);

export const focusedSelector = ({ task: { focused } }: RootState) => (
  index: number,
  uuid: string
) => focused === index || focused === uuid;

export const getTotalTasks = (state: RootState) =>
  state.task.todo.length + state.task.completed.length;
