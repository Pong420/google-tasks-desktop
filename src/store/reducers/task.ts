import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import arrayMove from 'array-move';
import uuid from 'uuid';

export interface TaskState {
  focusIndex: string | number | null;
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
          // position & updated is required when sorting by date
          position: previousTask && previousTask.position,
          updated: new Date().toISOString(),
          ...newTaskPlayload
        };

        tasks.splice(index, 0, newTask);

        return {
          ...state,
          ...classify(tasks),
          focusIndex: newTask.uuid
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
        const { uuid, previousTaskIndex = null } = action.payload;

        return {
          ...state,
          ...classify(state.tasks, task => {
            if (task.uuid === uuid) {
              return null;
            }
            return task;
          }),
          focusIndex: previousTaskIndex
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
