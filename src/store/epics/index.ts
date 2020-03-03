import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskEpics from './task';

export default combineEpics(...authEpics, ...taskEpics);
