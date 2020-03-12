import { ofType, Epic } from 'redux-observable';
import { generatePath } from 'react-router-dom';
import { RouterAction, push } from 'connected-react-router';
import { of, defer } from 'rxjs';
import { switchMap, mergeMap, map, tap } from 'rxjs/operators';
import {
  newTaskList,
  taskListActions,
  TaskListActions
} from '../actions/taskList';
import { RootState } from '../reducers';
import { tasklists } from '../../service';
import { PATHS } from '../../constants';
import { Schema$TaskList } from '../../typings';
import NProgress from '../../utils/nprogress';

type Actions = TaskListActions | RouterAction;
type TaskEpic = Epic<Actions, Actions, RootState>;

const newTaskListEpic: TaskEpic = action$ =>
  action$.pipe(
    ofType<Actions, ReturnType<typeof newTaskList>>('NEW_TASK_LIST'),
    switchMap(action => {
      NProgress.start();
      return defer(() =>
        tasklists.insert({ requestBody: { title: action.payload } })
      ).pipe(
        map(res => res.data as Schema$TaskList),
        mergeMap(tasklist =>
          of(
            taskListActions.createTaskList(tasklist),
            push(
              generatePath(PATHS.TASKLIST, {
                taskListId: tasklist.id
              })
            )
          ).pipe(tap(() => NProgress.done()))
        )
      );
    })
  );

export default [newTaskListEpic];
