import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';
import merge from 'lodash/merge';

export interface TaskListState {
  taskLists: Schema$TaskList[];
  currentTaskListId: string;
  currentTaskList: Schema$TaskList | null;
  creatingNewTaskList: boolean;
}

const initialState: TaskListState = {
  taskLists: [],
  currentTaskList: null,
  currentTaskListId: '',
  creatingNewTaskList: false
};

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
        taskLists: [
          ...action.payload.slice(0, 1),
          ...action.payload.slice(1).sort((a, b) => {
            if (a.updated && b.updated) {
              return +new Date(a.updated!) > +new Date(b.updated!) ? 1 : -1;
            }

            return 0;
          })
        ]
      };

    case TaskListActionTypes.SET_CURRENT_TASK_LIST:
      return {
        ...state,
        currentTaskListId: action.payload.id!,
        currentTaskList: action.payload
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

    default:
      return state;
  }
}
