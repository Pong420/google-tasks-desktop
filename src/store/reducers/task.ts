import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import uuid from 'uuid';
import { tasks_v1 } from 'googleapis';

export interface TaskState {
  tasks: Schema$Task[];
  todoTasks: Schema$Task[];
  completedTasks: Schema$Task[];
}

const initialState: TaskState = {
  tasks: [],
  todoTasks: [],
  completedTasks: []
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
        ...classify(action.payload as Schema$Task[], task => ({
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
        ...classify(state.tasks.slice(), task =>
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

function classify(
  data: Schema$Task[],
  middleware: (task: Schema$Task) => Schema$Task
) {
  const tasks: Schema$Task[] = [];
  const todoTasks: Schema$Task[] = [];
  const completedTasks: Schema$Task[] = [];

  data.forEach(task_ => {
    const task = middleware(task_);
    if (task.status === 'completed') {
      completedTasks.push(task);
    } else {
      todoTasks.push(task);
    }

    tasks.push(task);
  });

  return { tasks, todoTasks, completedTasks };
}
