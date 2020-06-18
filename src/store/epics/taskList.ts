import { ofType, Epic } from 'redux-observable';
import { generatePath } from 'react-router-dom';
import { RouterAction, push, replace } from 'connected-react-router';
import { of, defer, empty, merge } from 'rxjs';
import { switchMap, mergeMap, map, tap } from 'rxjs/operators';
import { taskListActions, TaskListActions } from '../actions/taskList';
import { RootState } from '../reducers';
import { tasklists, taskListAPI } from '../../service';
import { PATHS } from '../../constants';
import { ExtractAction, Schema$TaskList } from '../../typings';
import { currentTaskListsSelector } from '../selectors';
import NProgress from '../../utils/nprogress';

type Actions = TaskListActions | RouterAction;
type TaskEpic = Epic<Actions, Actions, RootState>;

const gotoMasterTasklist = () => of(replace(generatePath(PATHS.TASKLIST, {})));

const newTaskListEpic: TaskEpic = action$ =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'NEW_TASK_LIST'>>('NEW_TASK_LIST'),
    tap(() => NProgress.start()),
    switchMap(action =>
      defer(() =>
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
          )
        )
      )
    )
  );

const deleteCurrentTaskListEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType('DELETE_CURRENT_TASKLIST'),
    tap(() => NProgress.start()),
    switchMap(() => {
      const current = currentTaskListsSelector(state$.value);
      return current
        ? defer(() => taskListAPI.delete({ tasklist: current.id })).pipe(
            mergeMap(() =>
              merge(
                of(taskListActions.deleteTaskList({ id: current.id })),
                gotoMasterTasklist()
              )
            )
          )
        : empty();
    })
  );

const updateTaskListEpic: TaskEpic = action$ =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'UPDATE_TASK_LIST'>>(
      'UPDATE_TASK_LIST'
    ),
    switchMap(action => {
      const { id } = action.payload;
      return defer(() =>
        id
          ? taskListAPI.update({
              tasklist: id,
              requestBody: action.payload
            })
          : Promise.resolve()
      ).pipe(mergeMap(() => empty()));
    })
  );

const sortTaskListEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType('DELETE_TASK_LIST', 'SORT_TASKLIST_BY'),
    switchMap(() => {
      window.taskListSortByDateStorage.save(state$.value.taskList.sortByDate);
      return empty();
    })
  );

const redirectEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType('PAGINATE_TASK_LIST', 'SYNC_TASKLIST'),
    switchMap(() =>
      currentTaskListsSelector(state$.value) ? empty() : gotoMasterTasklist()
    )
  );

export default [
  newTaskListEpic,
  deleteCurrentTaskListEpic,
  updateTaskListEpic,
  sortTaskListEpic,
  redirectEpic
];
