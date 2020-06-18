import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskActionTypes, TaskActions, taskActions } from '../actions/task';
import { taskSelector } from '../selectors';
import { Schema$Task } from '../../typings';

interface State {
  todo: typeof todoState;
  completed: typeof completeState;
  focused: string | null;
  deleted: { [x: string]: Schema$Task };
}

const [todoState, todoReducer] = createCRUDReducer<Schema$Task, 'uuid'>({
  key: 'uuid',
  prefill: false,
  actions: TaskActionTypes
});

const [completeState, completeReducer] = createCRUDReducer<Schema$Task, 'uuid'>(
  {
    key: 'uuid',
    prefill: false,
    actions: TaskActionTypes
  }
);

const initialState: State = {
  todo: todoState,
  completed: completeState,
  focused: null,
  deleted: {}
};

export function taskReducer(
  state = initialState,
  action: TaskActions
): typeof initialState {
  switch (action.type) {
    case 'SYNC_TASKS':
    case 'PAGINATE_TASK':
      return (() => {
        const todo: Schema$Task[] = [];
        const completed: Schema$Task[] = [];
        for (const task of action.payload.data) {
          task.hidden || task.status === 'completed'
            ? completed.push(task)
            : todo.push(task);
        }
        return {
          ...state,
          todo: todoReducer(
            todoState,
            taskActions.paginateTask({
              data: todo,
              total: todo.length,
              pageNo: 1
            })
          ),
          completed: todoReducer(
            completeState,
            taskActions.paginateTask({
              data: completed,
              total: completed.length,
              pageNo: 1
            })
          )
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
        const updateTask = taskActions.updateTask(action.payload);

        if (action.payload.status === 'completed') {
          return {
            ...state,
            todo: todoReducer(state.todo, deleteTask),
            completed: completeReducer(
              state.completed,
              taskActions.createTask(state.todo.byIds[uuid])
            )
          };
        } else if (action.payload.status === 'needsAction') {
          return {
            ...state,
            todo: todoReducer(
              state.todo,
              taskActions.createTask(state.completed.byIds[uuid])
            ),
            completed: completeReducer(state.completed, deleteTask)
          };
        }

        return {
          ...state,
          ...(isTodoTask
            ? { todo: todoReducer(state.todo, updateTask) }
            : { completed: completeReducer(state.completed, updateTask) })
        };
      })();

    case 'DELETE_TASK':
      return (() => {
        const { uuid, prevTaskIndex } = action.payload;
        const isTodoTask = state.todo.ids.includes(uuid);
        const [newState, task] = isTodoTask
          ? [todoReducer(state.todo, action), state.todo.byIds[uuid]]
          : [
              completeReducer(state.completed, action),
              state.completed.byIds[uuid]
            ];
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
        const action_ = taskActions.updateTask(task);
        const newState = isTodoTask
          ? { todo: todoReducer(state.todo, action_) }
          : { completed: completeReducer(state.completed, action_) };

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
