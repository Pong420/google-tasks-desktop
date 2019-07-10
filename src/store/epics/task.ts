import { empty, from, timer, of, forkJoin } from 'rxjs';
import {
  debounceTime,
  groupBy,
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  pairwise,
  take
} from 'rxjs/operators';
import { ofType, Epic, ActionsObservable } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  TaskActions,
  TaskActionTypes,
  NewTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess,
  MoveTask,
  MoveTaskSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { taskSelector } from '../selectors';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { Schema$Task } from '../../typings';

type Actions = TaskActions;
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
  action$.pipe(
    ofType<Actions, NewTaskSuccess>(TaskActionTypes.NEW_TASK_SUCCESS),
    filter(success => success.payload.uuid === uuid)
  );

const taskApiEpic: TaskEpic = (action$, state$, { nprogress }) => {
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
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.DELETE_TASK:
          const deleteTaskRequest$ = (task?: string) =>
            from(tasksAPI.delete({ tasklist, task })).pipe(
              map<unknown, Actions>(() => ({
                type: TaskActionTypes.DELETE_TASK_SUCCESS
              }))
            );

          if (!action.payload.id) {
            return onNewTaskSuccess$(action$, action.payload.uuid).pipe(
              switchMap(success => deleteTaskRequest$(success.payload.id))
            );
          }

          return deleteTaskRequest$(action.payload.id);

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
              timer(2000).pipe(
                mergeMap(() =>
                  from(
                    tasksAPI.insert({ tasklist, requestBody, previous })
                  ).pipe(
                    map(({ data }) => data),
                    map<tasks_v1.Schema$Task, Actions>(task => ({
                      type: TaskActionTypes.NEW_TASK_SUCCESS,
                      payload: {
                        ...task,
                        uuid
                      }
                    }))
                  )
                )
              );

            if (prevTask && !prevTask.id) {
              return onNewTaskSuccess$(action$, prevTask.uuid).pipe(
                switchMap(success =>
                  newTaskRequest$(action.payload.uuid, success.payload.id)
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

const updateTaskEpic: TaskEpic = (action$, state$) => {
  const updateTaskRequest$ = (requestBody: Schema$Task) => {
    // delete requestBody.completed;
    // delete requestBody.position;
    // delete requestBody.updated;

    // if (!requestBody.id) {
    //   throw new Error('update task request failed, id is missing');
    // }

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
      takeUntil(action$.pipe(ofType(TaskActionTypes.UPDATE_TASK)))
    );
  };

  return action$.pipe(
    ofType<Actions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        switchMap(action => {
          const task = state$.value.task.byIds[action.payload.uuid];

          if (task) {
            if (task.id) {
              return updateTaskRequest$({
                ...task,
                ...action.payload
              });
            }

            return onNewTaskSuccess$(action$, action.payload.uuid).pipe(
              switchMap(success =>
                updateTaskRequest$({
                  ...success.payload,
                  ...action.payload
                })
              )
            );
          }

          return empty();
        })
      )
    )
  );
};

const moveTaskEpic: TaskEpic = (action$, state$) => {
  const moveTaskRequest$ = (uuid: UUID) =>
    state$.pipe(
      switchMap(state => [undefined, ...state.task.todo]),
      pairwise(),
      filter(([_, b]) => !!b && b === uuid),
      map(ids => ids.map(uuid => taskSelector(state$.value, uuid))),
      switchMap(([prevTask, currTask]) => {
        return from(
          tasksAPI.move({
            tasklist: state$.value.taskList.id,
            task: currTask!.id,
            previous: prevTask && prevTask.id
          })
        ).pipe(
          map(({ data }) => data),
          map<tasks_v1.Schema$Task, MoveTaskSuccess>(payload => ({
            type: TaskActionTypes.MOVE_TASKS_SUCCESS,
            payload
          }))
        );
      }),
      take(1)
    );

  return action$.pipe(
    ofType<Actions, MoveTask>(TaskActionTypes.MOVE_TASKS),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(500),
        switchMap(action => {
          const task = state$.value.task.byIds[action.payload.uuid];
          if (!task.id) {
            return onNewTaskSuccess$(action$, task.uuid).pipe(
              switchMap(success => moveTaskRequest$(success.payload.uuid))
            );
          }

          return moveTaskRequest$(task.uuid);
        })
      )
    )
  );
};

export default [taskApiEpic, updateTaskEpic, moveTaskEpic];
