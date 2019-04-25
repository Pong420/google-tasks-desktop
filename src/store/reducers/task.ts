import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import arrayMove from 'array-move';
import uuid from 'uuid';

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
      const sortedTasks = (action.payload as Schema$Task[]).sort((a, b) => {
        if (a.position && b.position) {
          if (a.position > b.position) return 1;
          if (a.position < b.position) return -1;
          return 0;
        }

        if (a.updated && b.updated) {
          return +new Date(a.updated!) > +new Date(b.updated!) ? 1 : -1;
        }

        return -1;
      });

      return {
        ...state,
        ...classify(sortedTasks, task => ({
          ...task,
          uuid: uuid.v4()
        }))
      };

    case TaskActionTypes.NEW_TASK:
      const tasks = state.tasks.slice();
      const index = state.todoTasks.findIndex(
        ({ uuid }) =>
          !!action.payload.previousTask &&
          uuid === action.payload.previousTask.uuid
      );

      tasks.splice(index + 1, 0, action.payload);

      return {
        ...state,
        ...classify(tasks)
      };

    case TaskActionTypes.NEW_TASK_SUCCESS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.uuid === action.payload.uuid
            ? { ...action.payload, ...task }
            : task
        )
      };

    case TaskActionTypes.DELETE_TASK:
      return {
        ...state,
        ...classify(state.tasks, task => {
          if (task.uuid === action.payload.uuid) {
            return null;
          }

          return task;
        })
      };

    case TaskActionTypes.UPDATE_TASK:
      // FIXME: seems this part cause delay on input

      return {
        ...state,
        ...classify(state.tasks, task =>
          task.uuid === action.payload.uuid
            ? { ...task, ...action.payload }
            : task
        )
      };

    case TaskActionTypes.MOVE_TASKS:
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

  data.slice().forEach(task_ => {
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

  return {
    tasks,
    todoTasks,
    completedTasks
  };
}
