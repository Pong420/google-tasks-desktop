import { RouterAction, LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router-dom';
import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';
import { PATHS } from '../../constants';

export interface TaskListState {
  taskLists: Schema$TaskList[];
  currentTaskListId: string;
  currentTaskList: Schema$TaskList | null;
  creatingNewTaskList: boolean;
  sortByDate: boolean;
}

const initialState: TaskListState = {
  taskLists: [],
  currentTaskList: null,
  currentTaskListId: '',
  creatingNewTaskList: false,
  sortByDate: false
};

const SORT_BY_DATE_IDS = 'SORT_BY_DATE_IDS';
const sortByDateTasksListIds: string[] = JSON.parse(
  localStorage.getItem(SORT_BY_DATE_IDS) || '[]'
);

function getCurrentTaskList(taskLists: Schema$TaskList[], taskListId?: string) {
  let currentTaskList = taskLists[0] || null;
  if (taskListId) {
    for (const taskList of taskLists) {
      if (taskList.id === taskListId) {
        currentTaskList = taskList;
        break;
      }
    }
  }

  return currentTaskList;
}

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

        if (matches && state.taskLists.length) {
          const currentTaskList = getCurrentTaskList(
            state.taskLists,
            matches.params.taskListId
          );
          const currentTaskListId = currentTaskList.id!;

          return {
            ...state,
            currentTaskListId,
            currentTaskList,
            sortByDate: sortByDateTasksListIds.includes(currentTaskListId)
          };
        }

        return state;
      })();

    case TaskListActionTypes.GET_ALL_TASK_LIST:
      return {
        ...initialState
      };

    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return (() => {
        const currentTaskList = getCurrentTaskList(
          action.payload,
          state.currentTaskListId
        );

        return {
          ...state,
          taskLists: action.payload,
          currentTaskList,
          currentTaskListId: currentTaskList.id!
        };
      })();

    case TaskListActionTypes.NEW_TASK_LIST:
      return {
        ...state,
        creatingNewTaskList: true
      };

    case TaskListActionTypes.NEW_TASK_LIST_SUCCESS:
      return {
        ...state,
        creatingNewTaskList: false,
        taskLists: [...state.taskLists, action.payload]
      };

    case TaskListActionTypes.DELETE_TASK_LIST:
      return (() => {
        const target = action.payload || state.currentTaskListId;
        return {
          ...state,
          taskLists: state.taskLists.filter(({ id }) => id !== target)
        };
      })();

    case TaskListActionTypes.UPDATE_TASK_LIST:
      return (() => {
        let currentTaskList = state.currentTaskList;
        const taskLists = state.taskLists.map(taskList => {
          if (taskList.id === action.payload.tasklist) {
            currentTaskList = { ...taskList, ...action.payload.requestBody };
            return currentTaskList;
          }
          return taskList;
        });

        return {
          ...state,
          currentTaskList,
          taskLists
        };
      })();

    case TaskListActionTypes.TOGGLE_SORT_BY_DATE:
      return (() => {
        const sortByDate =
          typeof action.payload === 'boolean'
            ? action.payload
            : !state.sortByDate;

        if (sortByDate) {
          sortByDateTasksListIds.push(state.currentTaskListId);
        } else {
          sortByDateTasksListIds.splice(
            sortByDateTasksListIds.indexOf(state.currentTaskListId),
            1
          );
        }

        localStorage.setItem(
          SORT_BY_DATE_IDS,
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
