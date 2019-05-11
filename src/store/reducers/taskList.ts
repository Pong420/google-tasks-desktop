import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';
import merge from 'lodash/merge';

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

export default function(
  state = initialState,
  action: TaskListActions
): TaskListState {
  switch (action.type) {
    case TaskListActionTypes.GET_ALL_TASK_LIST:
      return {
        ...initialState
      };

    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: action.payload
      };

    case TaskListActionTypes.SET_CURRENT_TASK_LIST:
      return {
        ...state,
        currentTaskList: action.payload,
        currentTaskListId: action.payload.id!,
        sortByDate: sortByDateTasksListIds.includes(action.payload.id!)
      };

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
      return {
        ...state,
        taskLists: state.taskLists.filter(({ id }) => id !== action.payload)
      };

    case TaskListActionTypes.UPDATE_TASK_LIST:
      let current = state.currentTaskList;
      if (current === action.payload.tasklist) {
        current = merge(current, action.payload.requestBody);
      }

      return {
        ...state,
        currentTaskList: current,
        taskLists: state.taskLists.map(taskList =>
          taskList.id === action.payload.tasklist
            ? merge(taskList, action.payload.requestBody)
            : taskList
        )
      };

    case TaskListActionTypes.SORT_BY_DATE:
      if (action.payload) {
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
        sortByDate: action.payload
      };

    default:
      return state;
  }
}
