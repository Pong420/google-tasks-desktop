import { empty, from, of, concat } from 'rxjs';
import { mergeMap, switchMap, map, mapTo } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  RouterAction,
  LOCATION_CHANGE,
  createMatchSelector
} from 'connected-react-router';
import {
  TaskListActions,
  TaskListActionTypes,
  NewTaskListSuccess,
  SetCurrentTaskList
} from '../actions/taskList';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';
import { taskListAPI } from '../../api';
import { PATHS } from '../../constants';

type CominbinedActions = TaskListActions | RouterAction;

interface MatchParams {
  taskListId?: string;
}

const match = createMatchSelector(PATHS.TASKLIST);

const apiEpic: Epic<
  CominbinedActions,
  CominbinedActions,
  RootState,
  EpicDependencies
> = (action$, state$, { push, nprogress }) =>
  action$.pipe(
    ofType<CominbinedActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn || !state$.value.network.isOnline) {
        return empty();
      }

      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          nprogress.start();

          return from(taskListAPI.list()).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$TaskLists, TaskListActions>(({ items }) => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
              payload: items!.map(taskList => taskList)
            }))
          );

        case TaskListActionTypes.NEW_TASK_LIST:
          nprogress.inc(0.25);

          return from(taskListAPI.insert(action.payload)).pipe(
            map(({ data }) => data),
            mergeMap(payload =>
              concat(
                of<NewTaskListSuccess>({
                  type: TaskListActionTypes.NEW_TASK_LIST_SUCCESS,
                  payload
                }),
                push(PATHS.TASKLIST, {
                  taskListId: payload.id
                })
              )
            )
          );

        case TaskListActionTypes.DELETE_TASK_LIST:
          return concat(
            push(PATHS.TASKLIST, {
              taskListId: state$.value.taskList.taskLists[0].id
            }),
            from(taskListAPI.delete({ tasklist: action.payload })).pipe(
              mapTo<any, TaskListActions>({
                type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS
              })
            )
          );

        case TaskListActionTypes.UPDATE_TASK_LIST:
          return from(taskListAPI.patch(action.payload)).pipe(
            map(({ data }) => data),
            map<tasks_v1.Schema$TaskList, TaskListActions>(payload => ({
              type: TaskListActionTypes.UPDATE_TASK_LIST_SUCCESS,
              payload
            }))
          );

        default:
          return empty();
      }
    })
  );

const currentTaskListEpic: Epic<
  CominbinedActions,
  CominbinedActions,
  RootState
> = (action$, state$) =>
  action$.pipe(
    ofType<CominbinedActions, CominbinedActions>(
      LOCATION_CHANGE,
      TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
      TaskListActionTypes.UPDATE_TASK_LIST
    ),
    switchMap(() => {
      const matches = match(state$.value);

      if (matches) {
        const { taskListId } = matches.params as MatchParams;
        const { taskLists } = state$.value.taskList;

        if (taskLists.length) {
          let currentTaskList = taskLists[0];
          if (taskListId) {
            currentTaskList =
              taskLists.find(({ id }) => id === taskListId) || currentTaskList;
          }

          return of<SetCurrentTaskList>({
            type: TaskListActionTypes.SET_CURRENT_TASK_LIST,
            payload: currentTaskList
          });
        }
      }

      return empty();
    })
  );

export default [apiEpic, currentTaskListEpic];
