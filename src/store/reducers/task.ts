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

interface KeyedTasks {
  [id: string]: Schema$Task;
}

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...initialState,
        tasks: []
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
    case TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS:
      return (() => {
        let newTasks = action.payload as Schema$Task[];

        if (action.type === TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS) {
          const keyedTasksFromApi = newTasks.reduce<KeyedTasks>((acc, task) => {
            acc[task.id!] = task;
            return acc;
          }, {});

          const tasksNotSubmitted: Schema$Task[] = [];

          const keyedCurrentTasks = state.tasks.reduce<KeyedTasks>(
            (acc, task) => {
              if (task.id) {
                // check if task exisit in tasks return from api
                if (keyedTasksFromApi[task.id]) {
                  acc[task.id] = task;
                }
              } else {
                tasksNotSubmitted.push(task);
              }

              return acc;
            },
            {}
          );

          newTasks = [
            ...tasksNotSubmitted,
            ...Object.values({ ...keyedTasksFromApi, ...keyedCurrentTasks })
          ];
        }

        const sortedTasks = newTasks.sort((a, b) => {
          // check position is undefined for task created from `Add a tasl button`
          if (
            (a.position === undefined || b.position === undefined) &&
            a.position !== b.position
          ) {
            return -1;
          }

          return (
            compare(a.position, b.position) || compare(a.updated, b.updated)
          );
        });

        return {
          ...state,
          ...classify(sortedTasks, task => ({
            ...task,
            uuid: task.uuid || uuid.v4()
          }))
        };
      })();

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
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.uuid === action.payload.uuid
            ? { ...task, ...action.payload }
            : task
        )
      };

    case TaskActionTypes.MOVE_TASKS:
      return (() => {
        const { newIndex, oldIndex } = action.payload;
        const { tasks, todoTasks } = state;

        const newTask = todoTasks[newIndex];
        const oldTask = todoTasks[oldIndex];
        const realNewIndex = tasks.indexOf(newTask);
        const realoldIndex = tasks.indexOf(oldTask);

        return {
          ...state,
          ...classify(
            arrayMove(state.tasks, realoldIndex, realNewIndex),
            task => {
              if (task.uuid === newTask.uuid) {
                return { ...task, position: oldTask.position };
              }

              if (task.uuid === oldTask.uuid) {
                return { ...task, position: newTask.position };
              }

              return task;
            }
          ),
          focusIndex: newIndex
        };
      })();

    case TaskActionTypes.MOVE_TASKS_SUCCESS:
      return {
        ...state,
        ...classify(state.tasks, task =>
          task.id === action.payload.id ? { ...action.payload, ...task } : task
        )
      };

    case TaskActionTypes.MOVE_TO_ANOHTER_LIST:
      return (() => {
        return {
          ...state,
          ...classify(state.tasks, task => {
            if (task.uuid === action.payload.task.uuid) {
              return null;
            }
            return task;
          }),
          focusIndex: null
        };
      })();

    case TaskActionTypes.MOVE_TO_ANOHTER_LIST_SUCCESS:
      return (() => {
        const newTask = action.payload;
        return {
          ...state,
          ...(newTask && {
            tasks: [newTask, ...state.tasks],
            todoTasks: [newTask, ...state.todoTasks]
          })
        };
      })();

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
