import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import uuid from 'uuid';

export interface TaskState {
  tasks: Schema$Task[];
}

const initialState: TaskState = {
  tasks: []
};

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...initialState,
        tasks: []
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload.map(task => ({
          ...task,
          uuid: uuid.v4()
        }))
      };

    case TaskActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [
          {
            ...action.payload.params.requestBody,
            uuid: action.payload.uuid
          },
          ...state.tasks
        ]
      };

    case TaskActionTypes.ADD_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.slice().map(task =>
          task.uuid === action.payload.uuid
            ? {
                ...action.payload.task,
                ...task,
                id: action.payload.task.id
              }
            : task
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
