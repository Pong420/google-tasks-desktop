import { createCRUDReducer } from '@pong420/redux-crud';
import { TaskActionTypes } from '../actions/task';
import { Schema$Task } from '../../typings';

const [, taskReducer] = createCRUDReducer<Schema$Task, 'uuid'>({
  key: 'uuid',
  prefill: false,
  actions: TaskActionTypes
});

export { taskReducer };
