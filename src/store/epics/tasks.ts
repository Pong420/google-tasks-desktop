import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { TaskActions, TaskActionTypes } from '../actions/task';
import { RootState } from '../reducers';
import { saveTaskLists } from '../../utils/storage';

const saveTasksListEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskActions, TaskActions>(...Object.values(TaskActionTypes)),
    // TODO: debounce ?
    switchMap(action => {
      saveTaskLists(state$.value.task.taskLists);
      return empty();
    })
  );

export default [saveTasksListEpic];
