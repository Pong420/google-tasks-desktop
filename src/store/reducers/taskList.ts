import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';

export interface TaskListState {
  taskLists: Schema$TaskList[];
  creatingNewTaskList: boolean;
  newTaskListId: string;
}

const initialState: TaskListState = {
  taskLists: [],
  creatingNewTaskList: false,
  newTaskListId: ''
};

export default function(
  state = initialState,
  action: TaskListActions
): TaskListState {
  switch (action.type) {
    case TaskListActionTypes.GET_ALL_TASK_LIST:
      return {
        ...initialState
      };

    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: action.payload
      };

    case TaskListActionTypes.ADD_TASK_LIST:
      return {
        ...state,
        creatingNewTaskList: true
      };

    case TaskListActionTypes.ADD_TASK_LIST_SUCCESS:
      return {
        ...state,
        creatingNewTaskList: false,
        taskLists: [...state.taskLists, action.payload]
      };

    case TaskListActionTypes.DELETE_TASK_LIST:
      return {
        ...state,
        taskLists: state.taskLists.filter(({ id }) => id !== action.payload)
      };

    default:
      return state;
  }
}
