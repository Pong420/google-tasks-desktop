import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskActionTypes, TaskActions, taskActions } from '../actions/task';
import { Schema$Task } from '../../typings';

type DefaultState = typeof defaultState;
interface State extends DefaultState {
  focused: string | null;
  deleted: { [x: string]: Schema$Task };
}

const [defaultState, reducer] = createCRUDReducer<Schema$Task, 'uuid'>({
  key: 'uuid',
  prefill: false,
  actions: TaskActionTypes
});

const initialState: State = {
  ...defaultState,
  focused: null,
  deleted: {}
};

export function taskReducer(
  state = initialState,
  action: TaskActions
): typeof initialState {
  switch (action.type) {
    case 'CREATE_TASK':
      return (() => {
        const { prevTask, uuid } = action.payload;
        const index = prevTask ? state.ids.indexOf(prevTask) + 1 : 0;
        const newTask = { uuid };

        return {
          ...state,
          focused: uuid,
          ids: [...state.ids.slice(0, index), uuid, ...state.ids.slice(index)],
          list: [
            ...state.list.slice(0, index),
            newTask,
            ...state.list.slice(index)
          ],
          byIds: {
            ...state.byIds,
            [uuid]: newTask
          }
        };
      })();

    case 'DELETE_TASK':
      return (() => {
        const { uuid, prevTask } = action.payload;
        const newState = reducer(state, action);

        return {
          ...state,
          ...newState,
          deleted: {
            ...state.deleted,
            [uuid]: state.byIds[uuid]!
          },
          focused:
            prevTask ||
            (state.focused && state.ids[0] === uuid ? newState.ids[0] : null) // for delete task by backspace
        };
      })();

    case 'FOCUS_TASK':
      return {
        ...state,
        focused: action.payload || null
      };

    case 'CREATE_TASK_SUCCESS':
    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        ...reducer(state, taskActions.updateTask(action.payload))
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
