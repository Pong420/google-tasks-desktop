import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';

const [, taskListReducer] = createCRUDReducer<Schema$TaskList, 'id'>({
  key: 'id',
  prefill: false,
  actions: TaskListActionTypes,
  onLocationChanged: null
});

export { taskListReducer };
