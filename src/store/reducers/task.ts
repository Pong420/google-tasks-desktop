import { TaskActions, TaskActionTypes } from '../actions/task';
import { TaskLists, TaskList } from '../../typings';
import { getTaskLists } from '../../utils/storage';

export interface TasksState {
  taskLists: TaskLists;
}

const initialState: TasksState = {
  taskLists: getTaskLists()
};

export default function(state = initialState, action: TaskActions) {
  const mappedStorage = new Map(state.taskLists.slice(0));
  const taskListName = action.payload && action.payload.taskListName;
  const taskList: TaskList | undefined = taskListName
    ? mappedStorage.get(taskListName)
    : undefined;

  switch (action.type) {
    case TaskActionTypes.ADD_TASK:
      return {
        ...state,
        taskLists: [
          ...mappedStorage.set(action.payload.taskListName, {
            ...taskList!,
            tasks: [...taskList!.tasks, action.payload]
          })
        ]
      };

    case TaskActionTypes.DELETE_TASK:
      return {
        ...state,
        taskLists: [
          ...mappedStorage.set(action.payload.taskListName, {
            ...taskList!,
            tasks: taskList!.tasks
              .slice()
              .filter(({ id }) => id !== action.payload.id)
          })
        ]
      };

    case TaskActionTypes.UPDATE_TASK:
    case TaskActionTypes.TOGGLE_COMPLETE:
      return {
        ...state,
        taskLists: [
          ...mappedStorage.set(action.payload.taskListName, {
            ...taskList!,
            tasks: taskList!.tasks
              .slice()
              .map(task =>
                task.id === action.payload.id ? action.payload : task
              )
          })
        ]
      };

    default:
      return state;
  }
}
