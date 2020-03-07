import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskActionTypes, TaskActions } from '../actions/task';
import { Schema$Task } from '../../typings';
import { taskUUID } from '../../service';

type DefaultState = typeof defaultState;
interface State extends DefaultState {
  focused: string | null;
}

const [defaultState, reducer] = createCRUDReducer<Schema$Task, 'uuid'>({
  key: 'uuid',
  prefill: false,
  actions: TaskActionTypes
});

const initialState: State = {
  ...defaultState,
  focused: null
};

export function taskReducer(
  state = initialState,
  action: TaskActions
): typeof initialState {
  switch (action.type) {
    case 'CREATE_TASK':
      return (() => {
        const { prevTask } = action.payload || {};
        const index = prevTask ? state.ids.indexOf(prevTask) + 1 : 0;
        const uuid = taskUUID.next();
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
      return {
        ...state,
        ...reducer(state, action),
        focused: action.payload.prevTask || state.focused
      };

    case 'FOCUS_TASK':
      return {
        ...state,
        focused: action.payload || null
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
