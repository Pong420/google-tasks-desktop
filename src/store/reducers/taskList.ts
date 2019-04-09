import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { TaskList } from '../../typings';
import { getTaskLists } from '../../utils/storage';
import mergeWith from 'lodash/mergeWith';
import uuid from 'uuid';

export interface TaskListState {
  taskLists: TaskList[];
}

const initialState: TaskListState = {
  taskLists: getTaskLists()
};

export default function(state = initialState, action: TaskListActions) {
  switch (action.type) {
    case TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: mergeWith(state.taskLists, action.payload, src => {
          return {
            tid: uuid.v4(),
            ...src,
            updated: new Date().toISOString()
          };
        })
      };

    default:
      return state;
  }
}
