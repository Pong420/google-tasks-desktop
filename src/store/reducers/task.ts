import { TaskActions, TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';
import { compare } from '../../utils/compare';
import { taskIds } from '../';

type UUID = Schema$Task['uuid'];

export interface TaskState {
  byIds: { [id: string]: Schema$Task };
  todo: UUID[];
  completed: UUID[];
  focused: string | number | null;
}

const initialState: TaskState = {
  byIds: {},
  todo: [],
  completed: [],
  focused: null
};

export default function(state = initialState, action: TaskActions): TaskState {
  switch (action.type) {
    case TaskActionTypes.GET_ALL_TASKS:
      return {
        ...initialState
      };

    case TaskActionTypes.GET_ALL_TASKS_SUCCESS:
      return (() => {
        const todo: UUID[] = [];
        const completed: UUID[] = [];

        const byIds = (action.payload as Schema$Task[])
          .sort((a, b) => {
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
          })
          .reduce<{ [id: string]: Schema$Task }>((acc, task) => {
            const uuid = task.uuid || taskIds.next();

            if (task.status === 'completed') {
              completed.push(uuid);
            } else {
              todo.push(uuid);
            }

            acc[uuid] = {
              ...task,
              uuid
            };

            return acc;
          }, {});

        return {
          ...state,
          byIds,
          todo,
          completed
        };
      })();

    case TaskActionTypes.NEW_TASK:
      return (() => {
        const { previousTask, uuid, ...newTaskPlayload } = action.payload;
        const index = !!previousTask
          ? state.todo.indexOf(previousTask.uuid) + 1
          : 0;

        const newTask = {
          // position & updated is required when sorting by date
          position: previousTask && previousTask.position,
          updated: new Date().toISOString(),
          uuid,
          ...newTaskPlayload
        };

        return {
          ...state,
          todo: insert(state.todo, uuid, index),
          byIds: { ...state.byIds, [uuid]: newTask },
          focused: uuid
        };
      })();

    case TaskActionTypes.UPDATE_TASK:
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
    case TaskActionTypes.NEW_TASK_SUCCESS:
      return (() => {
        const newTask = action.payload;
        const { uuid, status } = newTask;
        let { todo, completed } = state;

        if (status === 'completed') {
          todo = remove(todo, uuid);
          completed.push(uuid);
          completed.sort(compare);
        } else {
          completed = remove(completed, uuid);
          todo = [uuid, ...todo];
        }

        return {
          ...state,
          todo,
          completed,
          byIds: {
            ...state.byIds,
            [newTask.uuid]: { ...state.byIds[uuid], ...newTask }
          }
        };
      })();

    case TaskActionTypes.DELETE_TASK:
      return (() => {
        const { uuid } = action.payload;
        const { [action.payload.uuid]: deleted, ...byIds } = state.byIds;
        return {
          ...state,
          byIds,
          todo: remove(state.todo, uuid),
          completed: remove(state.completed, uuid)
        };
      })();

    case TaskActionTypes.SET_FOCUSED:
      return {
        ...state,
        focused: action.payload
      };

    default:
      return state;
  }
}

function insert<T>(arr: T[], val: T, index: number) {
  return [...arr.slice(0, index), val, ...arr.slice(index)];
}

function remove<T>(arr_: T[], val: any) {
  const arr = arr_.slice();

  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
}
