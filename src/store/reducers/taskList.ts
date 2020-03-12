import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskListActionTypes, TaskListActions } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';

type DefaultState = typeof defaultState;
interface State extends DefaultState {
  creatingTasklist: boolean;
}

const [defaultState, reducer] = createCRUDReducer<Schema$TaskList, 'id'>({
  key: 'id',
  prefill: false,
  actions: TaskListActionTypes,
  onLocationChanged: null
});

const initialState: State = {
  ...defaultState,
  creatingTasklist: false
};

export function taskListReducer(
  state = initialState,
  action: TaskListActions
): State {
  switch (action.type) {
    case TaskListActionTypes.NEW:
      return {
        ...state,
        creatingTasklist: true
      };

    case TaskListActionTypes.CREATE:
      return {
        ...state,
        ...reducer(state, action),
        creatingTasklist: false
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
