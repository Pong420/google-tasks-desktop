import { TaskListActions, TaskListActionTypes } from '../actions/taskList';
import { TaskLists, TaskList } from '../../typings';
import { getTaskLists } from '../../utils/storage';
import uuid from 'uuid';

export interface TaskListState {
  taskLists: TaskLists;
}

const initialState: TaskListState = {
  taskLists: getTaskLists()
};

export default function(state = initialState, action: TaskListActions) {
  const mappedTaskLists = new Map(state.taskLists);

  switch (action.type) {
    case TaskListActionTypes.SYNC_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: action.payload.map<[string, TaskList]>(taskList => {
          const UUID = uuid.v4();
          return [
            UUID,
            {
              ...taskList,
              uuid: UUID,
              sync: true
            }
          ];
        })
      };

    case TaskListActionTypes.ADD_TASK_LIST_SUCCESS:
      return {
        ...state,
        taskLists: [
          ...mappedTaskLists.set(action.payload.uuid, {
            uuid: action.payload.uuid,
            sync: true,
            ...action.payload.data
          })
        ]
      };

    default:
      return state;
  }
}
