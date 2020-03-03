import { combineEpics } from 'redux-observable';
import authEpics from './auth';

export default combineEpics(...authEpics);
