import { combineReducers } from 'redux';
import task from './task';

export * from './task';

const rootReducer = combineReducers({
  task
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
