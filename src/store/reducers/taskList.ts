import { RouterAction, LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router-dom';
import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { PATHS, LAST_VISITED_TASKS_LIST_ID } from '../../constants';
import { Schema$TaskList } from '../../typings';
import { formatData } from '../../utils/formatData';
import { remove } from '../../utils/array';

export interface TaskListState {
  byIds: { [id: string]: Schema$TaskList };
  ids: string[];
  id?: string;
  sortByDate: boolean;
}

const SORT_BY_DATE_TASKS_LIST_IDS = 'SORT_BY_DATE_TASKS_LIST_IDS';
let sortByDateTasksListIds: string[] = JSON.parse(
  localStorage.getItem(SORT_BY_DATE_TASKS_LIST_IDS) || '[]'
);

const initialState: TaskListState = {
  byIds: {},
  ids: [],
  sortByDate: false
};

export default function(
  state = initialState,
  action: TaskListActions | RouterAction
): TaskListState {
  switch (action.type) {
    case LOCATION_CHANGE:
      return (() => {
        const matches = matchPath<{ taskListId?: string }>(
          action.payload.location.pathname,
          {
            path: PATHS.TASKLIST,
            strict: true
          }
        );

        if (matches) {
          const id = matches.params.taskListId;
          if (id) {
            localStorage.setItem(LAST_VISITED_TASKS_LIST_ID, id);

            return {
              ...state,
              id,
              sortByDate: sortByDateTasksListIds.includes(id)
            };
          }
        }

        return state;
      })();

    case TaskListActionTypes.GET_ALL_TASK_LIST:
      return {
        ...initialState,
        id: state.id,
        sortByDate: state.sortByDate
      };

    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return (() => {
        return {
          ...state,
          ...formatData(action.payload, 'id')
        };
      })();

    case TaskListActionTypes.DELETE_TASK_LIST:
      return (() => {
        const taskLisdId = action.payload!;
        const { [taskLisdId]: deleted, ...byIds } = state.byIds;
        return {
          ...state,
          byIds,
          ids: remove(state.ids, taskLisdId),
          id: undefined
        };
      })();

    case TaskListActionTypes.TOGGLE_SORT_BY_DATE:
      return (() => {
        const sortByDate =
          typeof action.payload === 'boolean'
            ? action.payload
            : !state.sortByDate;

        if (sortByDate) {
          sortByDateTasksListIds.push(state.id!);
        } else {
          sortByDateTasksListIds = remove(sortByDateTasksListIds, state.id!);
        }

        localStorage.setItem(
          SORT_BY_DATE_TASKS_LIST_IDS,
          JSON.stringify(sortByDateTasksListIds)
        );

        return {
          ...state,
          sortByDate
        };
      })();

    default:
      return state;
  }
}
