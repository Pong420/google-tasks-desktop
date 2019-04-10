import { combineReducers } from 'redux';
import auth from './auth';
import task from './task';
import taskList from './taskList';

const rootReducer = combineReducers({
  auth,
  task,
  taskList
});

export * from './auth';
export * from './task';
export * from './taskList';

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
