import { combineReducers } from 'redux';
import auth from './auth';
import taskList from './taskList';

const rootReducer = combineReducers({
  auth,
  taskList
});

export * from './auth';
export * from './taskList';

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
