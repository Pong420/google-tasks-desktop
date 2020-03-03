import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';

const pageSize = 99999999;

const [, taskReducer] = createCRUDReducer<Schema$Task, 'uuid'>({
  key: 'uuid',
  pageSize,
  actions: TaskActionTypes
});

export { taskReducer };
