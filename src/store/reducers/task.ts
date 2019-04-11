import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';

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
        ...initialState,
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
            id: action.payload.uuid,
            ...action.payload.params.requestBody
          },
          ...state.tasks
        ]
      };

    case TaskActionTypes.ADD_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks
          .slice()
          .map(task =>
            task.id === action.payload.uuid ? action.payload.task : task
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
