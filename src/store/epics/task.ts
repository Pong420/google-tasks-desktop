import { empty, from, timer, of, forkJoin, race, merge } from 'rxjs';
import {
  debounceTime,
  groupBy,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  take,
  takeWhile,
  withLatestFrom,
  catchError
} from 'rxjs/operators';
import { ofType, Epic, ActionsObservable } from 'redux-observable';
import { RouterAction } from 'connected-react-router';
import { tasks_v1 } from 'googleapis';
import {
  TaskActions,
  TaskActionTypes,
  NewTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess,
  MoveTask,
  MoveTaskSuccess,
  DeleteTask,
  MoveToAnotherList
} from '../actions/task';
import { NetworkActions, NetworkActionTypes } from '../actions/network';
import { RootState } from '../reducers';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { Schema$Task } from '../../typings';
import { PATHS } from '../../constants';

type Actions = TaskActions | NetworkActions | RouterAction;
type TaskEpic = Epic<Actions, Actions, RootState, EpicDependencies>;
type UUID = Schema$Task['uuid'];

const getAllTasks$ = (tasklist: string) =>
  from(
    tasksAPI.list({
      tasklist,
      showCompleted: true,
      showHidden: false
    })
  ).pipe(map(({ data }) => data.items));

const onNewTaskSuccess$ = (action$: ActionsObservable<Actions>, uuid: UUID) =>
  race(
    action$.pipe(
      ofType<Actions, NewTaskSuccess>(TaskActionTypes.NEW_TASK_SUCCESS),
      filter(success => success.payload.uuid === uuid)
    ),
    action$.pipe(
      ofType<Actions, DeleteTask>(TaskActionTypes.DELETE_TASK),
      takeWhile(deleted => deleted.payload.uuid === uuid),
      mergeMap(() => of(undefined))
    )
  );

const taskApiEpic: TaskEpic = (action$, state$, { nprogress, push }) => {
  return action$.pipe(
    mergeMap(action => {
      // current tasklist id
      const tasklist = state$.value.taskList.id;

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return getAllTasks$(action.payload).pipe(
            tap(() => nprogress.done()),
            map<tasks_v1.Schema$Tasks['items'], Actions>((payload = []) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload
            })),
            catchError(() => push(PATHS.TASKLIST)),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.DELETE_TASK:
          return (() => {
            const task = state$.value.task.temp[action.payload.uuid];
            const deleteTaskRequest$ = (task?: string) =>
              from(tasksAPI.delete({ tasklist, task })).pipe(
                map<unknown, Actions>(() => ({
                  type: TaskActionTypes.DELETE_TASK_SUCCESS,
                  payload: action.payload.uuid
                }))
              );

            return task.id
              ? deleteTaskRequest$(task.id)
              : onNewTaskSuccess$(action$, action.payload.uuid).pipe(
                  switchMap(success =>
                    success ? deleteTaskRequest$(success.payload.id) : empty()
                  )
                );
          })();

        case TaskActionTypes.DELETE_COMPLETED_TASKS:
          return from(tasksAPI.clear({ tasklist })).pipe(
            map<unknown, Actions>(() => ({
              type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS
            }))
          );

        case TaskActionTypes.NEW_TASK:
          return (() => {
            const { prevUUID, ...requestBody } = action.payload;
            const prevTask = prevUUID
              ? state$.value.task.byIds[prevUUID]
              : undefined;

            const newTaskRequest$ = (uuid: UUID, previous?: string) =>
              from(tasksAPI.insert({ tasklist, requestBody, previous })).pipe(
                map(({ data }) => data),
                map<tasks_v1.Schema$Task, Actions>(task => ({
                  type: TaskActionTypes.NEW_TASK_SUCCESS,
                  payload: {
                    ...task,
                    uuid
                  }
                }))
              );

            if (prevTask && !prevTask.id) {
              return onNewTaskSuccess$(action$, prevTask.uuid).pipe(
                switchMap(success =>
                  newTaskRequest$(
                    action.payload.uuid,
                    success && success.payload.id
                  )
                )
              );
            }

            return newTaskRequest$(
              action.payload.uuid,
              prevTask && prevTask.id
            );
          })();

        default:
          return empty();
      }
    })
  );
};

// TODO: debounce ?
const updateTaskEpic: TaskEpic = (action$, state$) => {
  const updateTaskRequest$ = (requestBody: Schema$Task) => {
    return from(
      tasksAPI.update({
        tasklist: state$.value.taskList.id,
        task: requestBody.id,
        requestBody
      })
    ).pipe(
      map(({ data }) => data),
      map<tasks_v1.Schema$Task, UpdateTaskSuccess>(payload => ({
        type: TaskActionTypes.UPDATE_TASK_SUCCESS,
        payload: {
          ...requestBody,
          ...payload
        }
      })),
      takeUntil(
        action$.pipe(
          ofType<Actions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
          filter(action => action.payload.uuid === requestBody.uuid)
        )
      )
    );
  };

  return action$.pipe(
    ofType<Actions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        mergeMap(action => {
          const task = state$.value.task.byIds[action.payload.uuid];

          if (task) {
            if (task.id) {
              return updateTaskRequest$({
                ...task,
                ...action.payload
              });
            }

            return onNewTaskSuccess$(action$, task.uuid).pipe(
              switchMap(success => {
                const latestTask = state$.value.task.byIds[task.uuid];
                return success && latestTask
                  ? updateTaskRequest$({
                      ...success.payload,
                      ...latestTask,
                      id: success.payload.id // make sure id will not bw overwritten
                    })
                  : empty();
              })
            );
          }

          return empty();
        })
      )
    )
  );
};

const moveTaskEpic: TaskEpic = (action$, state$) => {
  return action$.pipe(
    ofType<Actions, MoveTask>(TaskActionTypes.MOVE_TASKS),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(500),
        switchMap(action => {
          const { todo, byIds } = state$.value.task;
          const index = todo.indexOf(action.payload.uuid);
          const payload = [todo[index - 1], todo[index]].map(uuid => {
            const task = byIds[uuid];
            if (task) {
              return task.id
                ? of(task)
                : onNewTaskSuccess$(action$, task.uuid).pipe(
                    map(success => success && success.payload),
                    take(1)
                  );
            }
            return of(undefined);
          });

          return forkJoin<Schema$Task | undefined>(...payload).pipe(
            mergeMap(([prevTask, currTask]) => {
              // currTask may be delete before successful loaded
              if (currTask && currTask.id) {
                return from(
                  tasksAPI.move({
                    tasklist: state$.value.taskList.id,
                    task: currTask.id,
                    previous: prevTask && prevTask.id
                  })
                ).pipe(
                  map(({ data }) => data),
                  map<tasks_v1.Schema$Task, MoveTaskSuccess>(payload => ({
                    type: TaskActionTypes.MOVE_TASKS_SUCCESS,
                    payload
                  }))
                );
              }

              return empty();
            })
          );
        })
      )
    )
  );
};

const moveAnotherListEpic: TaskEpic = (action$, state$) => {
  return action$.pipe(
    ofType<Actions, MoveToAnotherList>(TaskActionTypes.MOVE_TO_ANOHTER_LIST),
    groupBy(({ payload }) => payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        switchMap(({ payload: { uuid, tasklist } }) => {
          const moveAnotherListRequest$ = (task: Schema$Task) => {
            const newTask$ = from(
              tasksAPI.insert({
                tasklist,
                requestBody: task
              })
            );

            const deleteTask$ = from(
              tasksAPI.delete({
                task: task.id,
                tasklist
              })
            );

            return forkJoin(newTask$, deleteTask$).pipe(
              map<unknown, Actions>(() => ({
                type: TaskActionTypes.MOVE_TO_ANOHTER_LIST_SUCCESS,
                payload:
                  state$.value.taskList.id === tasklist ? task : undefined
              }))
            );
          };

          const task = state$.value.task.temp[uuid];
          if (task) {
            if (!task.id) {
              return onNewTaskSuccess$(action$, task.uuid).pipe(
                switchMap(success =>
                  success
                    ? moveAnotherListRequest$({
                        ...success.payload,
                        ...task,
                        id: success.payload.id
                      })
                    : empty()
                )
              );
            }

            return moveAnotherListRequest$(task);
          }

          return empty();
        })
      )
    )
  );
};

const syncTasksEpic: TaskEpic = (action$, state$) => {
  const getAllTasksSilent$ = () => {
    const taskListId = state$.value.taskList.id;
    if (taskListId) {
      if (taskListId && state$.value.network.isOnline) {
        return getAllTasks$(taskListId).pipe(
          map<tasks_v1.Schema$Tasks['items'], Actions>((payload = []) => ({
            type: TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS,
            payload
          }))
        );
      }
    }
    return empty();
  };

  const withSyncPreferences = withLatestFrom(
    state$.pipe(map(({ preferences }) => preferences.sync))
  );

  const reconnection = action$.pipe(
    ofType(NetworkActionTypes.OFFLINE),
    switchMap(() =>
      action$.pipe(
        ofType(NetworkActionTypes.ONLINE),
        withSyncPreferences,
        switchMap(([_, { reconnection }]) =>
          reconnection ? getAllTasksSilent$() : empty()
        )
      )
    )
  );

  return merge(
    reconnection,
    action$.pipe(
      withSyncPreferences,
      switchMap(([_, { enabled, inactiveHours }]) => {
        const ms = inactiveHours * 60 * 60 * 1000;

        if (!enabled || ms < 60 * 1000) {
          return empty();
        }

        return timer(ms).pipe(switchMap(() => getAllTasksSilent$()));
      })
    )
  );
};

export default [
  taskApiEpic,
  updateTaskEpic,
  moveTaskEpic,
  moveAnotherListEpic,
  syncTasksEpic
];
