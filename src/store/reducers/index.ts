import { combineReducers } from 'redux';
import task from './task';
import auth from './auth';

const rootReducer = combineReducers({
  task,
  auth
});

export * from './task';
export * from './auth';

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
