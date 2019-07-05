import { RootState } from '../reducers';

export const tasksSelector = (state: RootState) => (
  type: 'todo' | 'completed'
) => state.task[type].map(id => state.task.byIds[id]);
