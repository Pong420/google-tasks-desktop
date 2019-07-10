import { RootState } from '../reducers';
import { compare } from '../../utils/compare';

export const taskSelector = (state: RootState, uuid?: string) =>
  uuid ? state.task.byIds[uuid] : undefined;

export const focusedSelector = ({ task: { focused } }: RootState) => (
  index: number,
  uuid: string
) => focused === index || focused === uuid;

export const getTotalTasks = (state: RootState) =>
  state.task.todo.length + state.task.completed.length;

export const getTodoTasksByDate = (state: RootState) =>
  Object.entries(state.task.byDate).sort(([a], [b]) => compare(a, b));

export const getTodoTasksOrder = (state: RootState) =>
  state.taskList.sortByDate
    ? Object.keys(state.task.byDate)
        .sort()
        .flatMap(date => state.task.byDate[date])
    : state.task.todo;
