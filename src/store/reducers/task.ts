import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import arrayMove from 'array-move';
import uuid from 'uuid';

export interface TaskState {
  focusIndex: number | null;
  tasks: Schema$Task[];
  todoTasks: Schema$Task[];
  completedTasks: Schema$Task[];
}

const initialState: TaskState = {
  focusIndex: null,
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
      const sortedTasks = (action.payload as Schema$Task[]).sort(
        (a, b) =>
          compare(a.position, b.position) || compare(a.updated, b.updated)
      );

      return {
        ...state,
        ...classify(sortedTasks, task => ({
          ...task,
          uuid: uuid.v4()
        }))
      };

    case TaskActionTypes.NEW_TASK:
      return (() => {
        const tasks = state.tasks.slice();
        const { previousTask, ...newTaskPlayload } = action.payload;
        const index =
          tasks.findIndex(
            ({ uuid }) => !!previousTask && uuid === previousTask.uuid
          ) + 1;

        const newTask = {
          // position is required when sorting by date
          position: previousTask
            ? (Number(previousTask.position) + 1)
                .toString()
                .padStart(
                  previousTask.position ? previousTask.position.length : 20,
                  '0'
                )
            : undefined,
          ...newTaskPlayload
        };

        tasks.splice(index, 0, newTask);

        const newTasks = classify(tasks);

        return {
          ...state,
          ...newTasks,
          focusIndex: newTasks.todoTasks.indexOf(newTask)
        };
      })();

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
      return (() => {
        let newFocusIndex = 0;

        // For task deleted as backspace
        const focused = state.focusIndex !== null;

        return {
          ...state,
          ...classify(state.tasks, (task, index) => {
            if (task.uuid === action.payload.uuid) {
              newFocusIndex = index - 1;
              return null;
            }
            return task;
          }),
          focusIndex: focused ? Math.max(0, newFocusIndex) : null
        };
      })();

    case TaskActionTypes.UPDATE_TASK:
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
        ...classify(arrayMove(state.tasks, oldIndex, newIndex)),
        focusIndex: newIndex
      };

    case TaskActionTypes.DELETE_COMPLETED_TASKS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.status === 'completed' ? null : task
        )
      };

    case TaskActionTypes.SET_FOCUS_INDEX:
      return {
        ...state,
        focusIndex: action.payload
      };

    default:
      return state;
  }
}

function classify(
  data: Schema$Task[],
  middleware: (task: Schema$Task, index: number) => Schema$Task | null = task =>
    task
) {
  const tasks: Schema$Task[] = [];
  const todoTasks: Schema$Task[] = [];
  const completedTasks: Schema$Task[] = [];

  data.slice().forEach((task_, index) => {
    const task = middleware(task_, index);

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
