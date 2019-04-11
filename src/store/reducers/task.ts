import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import uuid from 'uuid';

export interface TaskState {
  tasks: Schema$Task[];
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

    case TaskActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [
          {
            ...action.payload,
            id: uuid.v4(),
            local: true
          },
          ...state.tasks
        ]
      };

    case TaskActionTypes.ADD_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.slice().map(task =>
          task.id !== action.payload.id
            ? task
            : {
                ...task,
                local: false
              }
        )
      };

    case TaskActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.slice().filter(({ id }) => id !== action.payload.id)
      };

    case TaskActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.slice().map(task =>
          task.id !== action.payload.task
            ? task
            : {
                ...task,
                ...action.payload.requestBody
              }
        )
      };

    default:
      return state;
  }
}
