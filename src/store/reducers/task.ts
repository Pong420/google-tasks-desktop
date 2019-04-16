import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import arrayMove from 'array-move';
import uuid from 'uuid';
import merge from 'lodash/merge';

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
      const sortedTasks = action.payload.sort((a, b) => {
        if (a.position && b.position) {
          return a.position > b.position ? 1 : -1;
        }
        return 0;
      });

      return {
        ...state,
        ...classify(sortedTasks as Schema$Task[], task => ({
          ...task,
          uuid: uuid.v4()
        }))
      };

    case TaskActionTypes.ADD_TASK:
      const newTask = {
        ...action.payload.params.requestBody,
        uuid: action.payload.uuid
      };

      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        todoTasks: [newTask, ...state.todoTasks]
      };

    case TaskActionTypes.ADD_TASK_SUCCESS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.uuid === action.payload.uuid
            ? merge(action.payload.task, task, {
                id: action.payload.task.id
              })
            : task
        )
      };

    case TaskActionTypes.DELETE_TASK:
      return {
        ...state,
        ...classify(state.tasks, task => {
          if (task.uuid === action.payload.requestBody.uuid) {
            return null;
          }

          return task;
        })
      };

    case TaskActionTypes.UPDATE_TASK:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.uuid === action.payload.uuid ? merge(task, action.payload) : task
        )
      };

    case TaskActionTypes.SORT_TASKS:
      const newIndex = state.tasks.indexOf(
        state.todoTasks[action.payload.newIndex]
      );
      const oldIndex = state.tasks.indexOf(
        state.todoTasks[action.payload.oldIndex]
      );

      return {
        ...state,
        ...classify(arrayMove(state.tasks, oldIndex, newIndex))
      };

    case TaskActionTypes.DELETE_COMPLETED_TASKS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.status === 'completed' ? null : task
        )
      };

    default:
      return state;
  }
}

function classify(
  data: Schema$Task[],
  middleware: (task: Schema$Task) => Schema$Task | null = task => task
) {
  const tasks: Schema$Task[] = [];
  const todoTasks: Schema$Task[] = [];
  const completedTasks: Schema$Task[] = [];

  data.forEach(task_ => {
    const task = middleware(task_);

    if (task !== null) {
      if (task.status === 'completed') {
        completedTasks.push(task);
      } else {
        todoTasks.push(task);
      }

      tasks.push(task);
    }
  });

  return { tasks, todoTasks, completedTasks };
}
