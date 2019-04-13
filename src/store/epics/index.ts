import { combineEpics } from 'redux-observable';
import authEpics from './auth';
import routerEpics from './router';
import taskEpics from './task';
import taskListEpics from './taskList';

export default combineEpics(
  ...authEpics,
  ...routerEpics,
  ...taskEpics,
  ...taskListEpics
);
