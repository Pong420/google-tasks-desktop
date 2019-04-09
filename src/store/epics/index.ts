import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import tasksEpics from './tasks';
import taskListEpics from './taskList';

export default combineEpics(...authEpics, ...tasksEpics, ...taskListEpics);
