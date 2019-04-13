import { empty, from, of, concat } from 'rxjs';
import { mergeMap, switchMap, map, mapTo, flatMap } from 'rxjs/operators';
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
  AddTaskListSuccess,
  SetCurrentTaskList
} from '../actions/taskList';
import { RootState } from '../reducers';
import { EpicDependencies } from '../epicDependencies';
import { taskApi } from '../../api';
import { PATHS } from '../../constants';

// TODO: dependenics for api

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
> = (action$, state$, { push }) =>
  action$.pipe(
    ofType<CominbinedActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          return from(taskApi.tasklists.list().then(({ data }) => data)).pipe(
            map<tasks_v1.Schema$TaskLists, TaskListActions>(({ items }) => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
              payload: items!.map(taskList => taskList)
            }))
          );

        case TaskListActionTypes.ADD_TASK_LIST:
          return from(
            taskApi.tasklists
              .insert({
                requestBody: {
                  title: action.payload.title
                }
              })
              .then(({ data }) => data)
          ).pipe(
            flatMap(payload =>
              concat(
                of<AddTaskListSuccess>({
                  type: TaskListActionTypes.ADD_TASK_LIST_SUCCESS,
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
            from(taskApi.tasklists.delete({ tasklist: action.payload })).pipe(
              mapTo<any, TaskListActions>({
                type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS
              })
            )
          );

        case TaskListActionTypes.UPDATE_TASK_LIST:
          return from(
            taskApi.tasklists.patch(action.payload).then(({ data }) => data)
          ).pipe(
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
