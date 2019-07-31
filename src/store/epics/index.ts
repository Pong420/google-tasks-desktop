import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import taskListEpics from './taskList';
import taskEpics from './task';
import preferencesEpics from './preferences';

export default combineEpics(
  ...authEpics,
  ...taskListEpics,
  ...taskEpics,
  ...preferencesEpics
);
