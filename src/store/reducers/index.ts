import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import task from './task';
import taskList from './taskList';
import preferences from './preferences';

const rootReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    task,
    taskList,
    preferences
  });

export * from './auth';
export * from './taskList';

export type RootState = ReturnType<ReturnType<typeof rootReducer>>;

export default rootReducer;
