import {
  TaskListActionTypes,
  TaskListActions,
  taskListActions
} from '../actions/taskList';
import { createCRUDReducer, removeFromArray } from '../../hooks/crud-reducer';
import { Schema$TaskList, ExtractAction } from '../../typings';
import { TaskActions } from '../actions';

type DefaultState = typeof defaultState;

interface State extends DefaultState {
  loading: boolean;
  sortByDate: string[];
}

const [defaultState, reducer] = createCRUDReducer<Schema$TaskList, 'id'>('id', {
  prefill: false,
  actionTypes: TaskListActionTypes
});

const initialState: State = {
  ...defaultState,
  loading: true,
  sortByDate: window.taskListSortByDateStorage.get()
};

export function taskListReducer(
  state = initialState,
  action: TaskListActions | ExtractAction<TaskActions, 'PAGINATE_TASK'>
): State {
  switch (action.type) {
    case 'PAGINATE_TASK':
      return {
        ...state,
        loading: false
      };

    case 'GET_TASKLISTS':
    case 'NEW_TASK_LIST':
      return {
        ...state,
        loading: true
      };

    case 'CREATE_TASK_LIST':
      return {
        ...state,
        ...reducer(state, action),
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

    case 'SYNC_TASKLIST':
      return {
        ...state,
        ...reducer(initialState, taskListActions.paginate(action.payload)),
        loading: false
      };

    default:
      return {
        ...state,
        ...reducer(state, action)
      };
  }
}
