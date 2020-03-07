import { createSelector } from 'reselect';
import { RootState } from '../reducers';

const allTaskSelector = (state: RootState) => state.task.list;

export const taskIdsSelector = createSelector(allTaskSelector, tasks =>
  tasks.reduce(
    (result, { uuid, status }) => {
      return {
        ...result,
        ...(!!uuid &&
          (status === 'completed'
            ? { completed: [...result.completed, uuid] }
            : { todo: [...result.todo, uuid] }))
      };
    },
    {
      todo: [] as string[],
      completed: [] as string[]
    }
  )
);

export const taskSelector = (id: string) => (state: RootState) =>
  state.task.byIds[id];

export const focusedSelector = (id: string) => (state: RootState) =>
  state.task.focused === id;
