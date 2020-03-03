import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskListActionTypes } from '../actions/taskList';
import { Schema$TaskList } from '../../typings';

const pageSize = 99999999;

const [, taskListReducer] = createCRUDReducer<Schema$TaskList, 'id'>({
  key: 'id',
  pageSize,
  actions: TaskListActionTypes,
  onLocationChanged: null
});

export { taskListReducer };
