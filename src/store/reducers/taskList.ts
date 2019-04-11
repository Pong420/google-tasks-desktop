import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';

export interface TaskListState {
  taskLists: Schema$TaskList[];
}

const initialState: TaskListState = {
  taskLists: []
};

export default function(state = initialState, action: TaskListActions) {
  switch (action.type) {
    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: action.payload
      };

    case TaskListActionTypes.ADD_TASK_LIST_SUCCESS:
      return {
        ...state,
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
