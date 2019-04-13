import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskEpics from './task';
import taskListEpics from './taskList';

export default combineEpics(...authEpics, ...taskEpics, ...taskListEpics);
