import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { TaskList, TaskLists } from '../../typings';
import { getTaskLists } from '../../utils/storage';
import uuid from 'uuid';
import { tasks_v1 } from 'googleapis';

export interface TaskListState {
  taskLists: tasks_v1.Schema$TaskList[];
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
