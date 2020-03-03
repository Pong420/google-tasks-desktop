import { RootState } from '../reducers';

export const taskIdsSelector = (state: RootState) =>
  state.task.list.reduce(
    (result, { uuid, completed }) => ({
      ...result,
      ...(!!uuid &&
        (completed
          ? { completed: [...result.completed, uuid] }
          : { todo: [...result.todo, uuid] }))
    }),
    {
      todo: [] as string[],
      completed: [] as string[]
    }
  );

export const taskSelector = (id: string) => (state: RootState) =>
  state.task.byIds[id];
