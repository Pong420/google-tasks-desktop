import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { taskReducer } from './task';
import { taskListReducer } from './taskList';
import auth from './auth';

const rootReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    taskList: taskListReducer,
    task: taskReducer,
    auth
  });

export type RootState = ReturnType<ReturnType<typeof rootReducer>>;

export default rootReducer;
