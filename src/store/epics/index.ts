import { combineEpics } from 'redux-observable';
import tasksEpics from './tasks';
import authEpics from './auth';

export default combineEpics(...tasksEpics, ...authEpics);
