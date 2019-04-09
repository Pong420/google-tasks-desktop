import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskListEpics from './taskList';

export default combineEpics(...authEpics, ...taskListEpics);
