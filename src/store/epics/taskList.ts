import { empty, from, forkJoin, Observable, of } from 'rxjs';
import { switchMap, mergeMap, map, mapTo } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import {
  TaskListActions,
  TaskListActionTypes,
  SyncTaskListSuccess,
  GetAllTaskListSuccess,
  GetTaskListSuccess,
  AddTaskListSuccess
} from '../actions/taskList';
import { RootState } from '../reducers';
import { saveTaskLists } from '../../utils/storage';
import { taskApi } from '../../api';
import { TaskList, TaskLists } from '../../typings';
import { tasks_v1 } from 'googleapis';

// TODO: dependenics for api

const syncTasksListEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      TaskListActionTypes.SYNC_TASK_LIST
    ),
    switchMap(() =>
      from(taskApi.tasklists.list()).pipe(
        map(res => {
          const result: SyncTaskListSuccess = {
            type: TaskListActionTypes.SYNC_TASK_LIST_SUCCESS,
            payload: res.data.items!
          };
          return result;
        })
      )
    )
  );

const saveTasksListEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    // TODO: debounce ?
    switchMap(() => {
      saveTaskLists(state$.value.taskList.taskLists);
      return empty();
    })
  );

const apiEpic: Epic<TaskListActions, TaskListActions, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType<TaskListActions, TaskListActions>(
      ...Object.values(TaskListActionTypes)
    ),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn) {
        return empty();
      }

      const mappedTaskList = new Map(state$.value.taskList.taskLists);

      switch (action.type) {
        case TaskListActionTypes.GET_ALL_TASK_LIST:
          return from(taskApi.tasklists.list()).pipe(
            mergeMap(res => {
              const newTaskList = new Map<string, TaskList>();

              res.data.items!.forEach(taskList => {
                const exists = mappedTaskList.get(taskList.id!);
                mappedTaskList.delete(taskList.id!);

                newTaskList.set(taskList.id!, {
                  ...exists,
                  ...taskList,
                  sync: new Date().toISOString()
                });
              });

              const taskListAdded: Array<Observable<any>> = [];
              mappedTaskList.forEach(taskList => {
                if (typeof taskList.sync === 'undefined') {
                  mappedTaskList.delete(taskList.id!);
                  taskListAdded.push(addTaskListApi$(taskList.title!));
                }
              });

              return (taskListAdded.length
                ? forkJoin(...taskListAdded)
                : of([])
              ).pipe(
                map((taskListAdded: TaskList[]) => {
                  taskListAdded.forEach(taskList => {
                    newTaskList.set(taskList.id!, {
                      ...taskList,
                      sync: new Date().toISOString()
                    });
                  });
                  return [...newTaskList];
                })
              );
            }),
            map<TaskLists, GetAllTaskListSuccess>(payload => ({
              type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS,
              payload
            }))
          );

        case TaskListActionTypes.ADD_TASK_LIST:
          return addTaskListApi$(action.payload.title).pipe(
            map<any, AddTaskListSuccess>(res => ({
              type: TaskListActionTypes.ADD_TASK_LIST_SUCCESS,
              payload: {
                oid: action.payload.id,
                id: res.data.id,
                data: res.data
              }
            }))
          );

        default:
          return empty();
      }
    })
  );

export default [syncTasksListEpic, saveTasksListEpic, apiEpic];

function addTaskListApi$(title: string) {
  return from(
    taskApi.tasklists.insert({
      requestBody: {
        title
      }
    })
  );
}
