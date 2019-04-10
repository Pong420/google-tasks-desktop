import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { TaskList, TaskLists } from '../../typings';
import { getTaskLists } from '../../utils/storage';
import uuid from 'uuid';

export interface TaskListState {
  taskLists: TaskLists;
}

const initialState: TaskListState = {
  taskLists: getTaskLists()
};

export default function(state = initialState, action: TaskListActions) {
  const mappedTaskList = new Map(state.taskLists.slice());

  switch (action.type) {
    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: action.payload
      };

    case TaskListActionTypes.ADD_TASK_LIST:
      mappedTaskList.set(action.payload.localId, {
        ...action.payload
      });

      return {
        ...state,
        taskLists: [...mappedTaskList]
      };

    case TaskListActionTypes.ADD_TASK_LIST_SUCCESS:
      mappedTaskList.delete(action.payload.localId);
      mappedTaskList.set(action.payload.data.id!, {
        ...action.payload.data,
        localId: action.payload.localId,
        sync: new Date().toISOString()
      });

      return {
        ...state,
        taskLists: [...mappedTaskList]
      };

    case TaskListActionTypes.DELETE_TASK_LIST:
      mappedTaskList.delete(action.payload);

      return {
        ...state,
        taskLists: [...mappedTaskList]
      };

    default:
      return state;
  }
}
