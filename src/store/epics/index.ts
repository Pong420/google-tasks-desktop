import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskListEpics from './taskList';
import taskEpics from './task';

export default combineEpics(...authEpics, ...taskListEpics, ...taskEpics);
