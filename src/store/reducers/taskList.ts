import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskListActionTypes, TaskListActions } from '../actions/taskList';
import { Schema$TaskList, ExtractAction } from '../../typings';
import { TaskActions } from '../actions';

type DefaultState = typeof defaultState;
interface State extends DefaultState {
  loading: boolean;
}

const [defaultState, reducer] = createCRUDReducer<Schema$TaskList, 'id'>({
  key: 'id',
  prefill: false,
  actions: TaskListActionTypes,
  onLocationChanged: null
});

const initialState: State = {
  ...defaultState,
  loading: false
};

export function taskListReducer(
  state = initialState,
  action:
    | TaskListActions
    | LocationChangeAction
    | ExtractAction<TaskActions, 'PAGINATE_TASK'>
): State {
  switch (action.type) {
    case LOCATION_CHANGE:
    case TaskListActionTypes.NEW:
      return {
        ...state,
        loading: true
      };

    case TaskListActionTypes.CREATE:
      return {
        ...state,
        ...reducer(state, action),
        loading: false
      };

    case 'PAGINATE_TASK':
      return {
        ...state,
        loading: false
      };

    case 'DELETE_TASK_LIST':
      return {
        ...reducer(state, action),
        loading: false
      };

    case 'DELETE_CURRENT_TASKLIST':
      return {
        ...state,
        loading: true
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
