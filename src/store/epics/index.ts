import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskEpics from './task';
import taskListEpics from './taskList';
import syncDataEpic from './preferences';

export default combineEpics(
  ...authEpics,
  ...taskEpics,
  ...taskListEpics,
  ...syncDataEpic
);
