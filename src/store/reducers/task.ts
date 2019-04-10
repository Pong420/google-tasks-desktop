import { TaskActions, TaskActionTypes } from '../actions/task';
import { tasks_v1 } from 'googleapis';

export interface TaskState {
  tasks: tasks_v1.Schema$Task[];
}

const initialState: TaskState = {
  tasks: []
};

export default function(state = initialState, action: TaskActions) {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...state,
        tasks: []
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload
      };

    default:
      return state;
  }
}
