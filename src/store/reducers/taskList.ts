import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { createCRUDReducer, removeFromArray } from '@pong420/redux-crud';
import { TaskListActionTypes, TaskListActions } from '../actions/taskList';
import { Schema$TaskList, ExtractAction } from '../../typings';
import { TaskActions } from '../actions';

type DefaultState = typeof defaultState;
interface State extends DefaultState {
  loading: boolean;
  sortByDate: string[];
}

const [defaultState, reducer] = createCRUDReducer<Schema$TaskList, 'id'>({
  key: 'id',
  prefill: false,
  actions: TaskListActionTypes,
  onLocationChanged: null
});

const initialState: State = {
  ...defaultState,
  loading: false,
  sortByDate: window.taskListSortByDateStorage.get()
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
        ...state,
        ...reducer(state, action),
        loading: false,
        sortByDate: removeFromArray(
          state.sortByDate,
          state.sortByDate.indexOf(action.payload.id)
        )
      };

    case 'DELETE_CURRENT_TASKLIST':
      return {
        ...state,
        loading: true
      };

    case 'SORT_TASKLIST_BY':
      const { id, orderType } = action.payload;
      const { sortByDate } = state;
      return {
        ...state,
        sortByDate:
          orderType === 'date'
            ? [...state.sortByDate, id]
            : removeFromArray(sortByDate, sortByDate.indexOf(id))
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
