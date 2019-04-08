import { combineEpics } from 'redux-observable';
import tasksEpic from './tasks';

export default combineEpics(...tasksEpic);
