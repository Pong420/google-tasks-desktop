import { RootState } from '../reducers';
import { compare } from '../../utils/compare';

export const getTotalTasks = ({ task }: RootState) =>
  task.todo.length + task.completed.length;

export const getTodoTasksByDate = (state: RootState) =>
  Object.entries(state.task.byDate).sort(([a], [b]) => compare(a, b));

// TODO: add sorting even not sort by date
export const getTodoTasksOrder = (state: RootState) =>
  state.taskList.sortByDate
    ? Object.keys(state.task.byDate)
        .sort()
        .flatMap(date => state.task.byDate[date])
    : state.task.todo;
