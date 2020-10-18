import { TaskActionTypes, TaskActions, taskActions } from '../actions/task';
import { taskSelector } from '../selectors';
import {
  createCRUDReducer,
  parsePaginatePayload
} from '../../hooks/crud-reducer';
import { Schema$Task } from '../../typings';

interface State {
  loading?: boolean;
  todo: typeof taskState;
  completed: typeof taskState;
  focused: string | null;
  deleted: { [x: string]: Schema$Task };
}

const [taskState, reducer] = createCRUDReducer<Schema$Task, 'uuid'>('uuid', {
  prefill: false,
  actionTypes: TaskActionTypes
});

const initialState: State = {
  loading: true,
  todo: taskState,
  completed: taskState,
  focused: null,
  deleted: {}
};

export function taskReducer(
  state = initialState,
  action: TaskActions
): typeof initialState {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        loading: true
      };

    case 'SYNC_TASKS':
    case 'PAGINATE_TASK':
      return (() => {
        const todo: Schema$Task[] = [];
        const completed: Schema$Task[] = [];
        const payload = parsePaginatePayload(action.payload);
        for (const task of payload.data) {
          task.hidden || task.status === 'completed'
            ? completed.push(task)
            : todo.push(task);
        }
        return {
          ...state,
          loading: false,
          todo: reducer(taskState, taskActions.paginate(todo)),
          completed: reducer(taskState, taskActions.paginate(completed))
        };
      })();

    case 'CREATE_TASK':
      return (() => {
        const { prevTask, uuid, inherit, ...task } = action.payload;
        const index = prevTask ? state.todo.ids.indexOf(prevTask) + 1 : 0;
        const inheritFrom = inherit && state.todo.byIds[inherit.uuid];
        const newTask = {
          uuid,
          ...task,
          ...(inheritFrom &&
            inherit!.keys.reduce(
              (t, k) => ({ ...t, [k]: inheritFrom[k] }),
              {} as Partial<Schema$Task>
            ))
        };
        return {
          ...state,
          focused: uuid,
          todo: {
            ...state.todo,
            ids: [
              ...state.todo.ids.slice(0, index),
              uuid,
              ...state.todo.ids.slice(index)
            ],
            list: [
              ...state.todo.list.slice(0, index),
              newTask,
              ...state.todo.list.slice(index)
            ],
            byIds: {
              ...state.todo.byIds,
              [uuid]: newTask
            }
          }
        };
      })();

    case 'UPDATE_TASK':
      return (() => {
        const { uuid } = action.payload;
        const isTodoTask = state.todo.ids.includes(uuid);
        const deleteTask = taskActions.deleteTask({ uuid });
        const updateTask = taskActions.update(action.payload);
        if (action.payload.status === 'completed') {
          return {
            ...state,
            todo: reducer(state.todo, deleteTask),
            completed: reducer(
              state.completed,
              taskActions.createTask(state.todo.byIds[uuid])
            )
          };
        } else if (action.payload.status === 'needsAction') {
          return {
            ...state,
            todo: reducer(
              state.todo,
              taskActions.createTask(state.completed.byIds[uuid])
            ),
            completed: reducer(state.completed, deleteTask)
          };
        }

        return {
          ...state,
          ...(isTodoTask
            ? { todo: reducer(state.todo, updateTask) }
            : { completed: reducer(state.completed, updateTask) })
        };
      })();

    case 'DELETE_TASK':
      return (() => {
        const { uuid, prevTaskIndex } = action.payload;
        const isTodoTask = state.todo.ids.includes(uuid);
        const [newState, task] = isTodoTask
          ? [reducer(state.todo, action), state.todo.byIds[uuid]]
          : [reducer(state.completed, action), state.completed.byIds[uuid]];
        const prevTask =
          typeof prevTaskIndex === 'number' && state.todo.ids[prevTaskIndex];
        const [first, second] = state.todo.ids;

        return {
          ...state,
          ...(isTodoTask ? { todo: newState } : { completed: newState }),
          deleted: {
            ...state.deleted,
            [uuid]: task!
          },
          focused:
            // focus if task deleted by backspace or it is the first task and focused
            prevTask || (state.focused && first === uuid && second) || null
        };
      })();

    case 'FOCUS_TASK':
      return {
        ...state,
        focused:
          (typeof action.payload === 'number'
            ? state.todo.ids[
                Math.max(0, Math.min(state.todo.ids.length - 1, action.payload))
              ]
            : action.payload) || null
      };

    case 'CREATE_TASK_SUCCESS':
    case 'UPDATE_TASK_SUCCESS':
      return (() => {
        const task = {
          ...action.payload,
          ...taskSelector(action.payload.uuid)({ task: state })
        };
        const isTodoTask = state.todo.ids.includes(task.uuid);
        const _action = taskActions.update(task);
        const newState = isTodoTask
          ? { todo: reducer(state.todo, _action) }
          : { completed: reducer(state.completed, _action) };

        return {
          ...state,
          ...newState
        };
      })();

    case 'MOVE_TASK':
      const { from, to } = action.payload;

      return to < 0
        ? state
        : {
            ...state,
            todo: {
              ...state.todo,
              ids: move(state.todo.ids, from, to),
              list: move(state.todo.list, from, to)
            }
          };

    case 'DELETE_ALL_COMPLETED_TASKS_SUCCESS':
      return { ...state, completed: initialState.completed };

    case 'MOVE_TO_ANOTHER_LIST':
      return (() => {
        const { uuid } = action.payload;
        return {
          ...state,
          focued: null,
          deleted: {
            ...state.deleted,
            [uuid]: state.todo.byIds[uuid]!
          },
          todo: reducer(state.todo, taskActions.deleteTask({ uuid }))
        };
      })();

    default:
      return state;
  }
}

// credit: https://github.com/sindresorhus/array-move
function move<T>(arr: T[], from: number, to: number) {
  const clone = arr.slice();
  clone.splice(to < 0 ? clone.length + to : to, 0, clone.splice(from, 1)[0]);
  return clone;
}
