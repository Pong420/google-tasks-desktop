import { empty, from, timer, forkJoin } from 'rxjs';
import {
  mergeMap,
  map,
  takeUntil,
  filter,
  mapTo,
  tap,
  debounce,
  groupBy,
  switchMap,
  pairwise,
  take,
  distinctUntilChanged,
  delay,
  withLatestFrom
} from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { tasks_v1 } from 'googleapis';
import {
  TaskActions,
  TaskActionTypes,
  NewTaskSuccess,
  UpdateTask,
  UpdateTaskSuccess,
  MoveTasks,
  MoveTasksSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { Schema$Task } from '../../typings';
import isEqual from 'lodash/fp/isEqual';

const apiEpic: Epic<TaskActions, TaskActions, RootState, EpicDependencies> = (
  action$,
  state$,
  { nprogress }
) => {
  return action$.pipe(
    filter(action => !/Update|Move/i.test(action.type)),
    mergeMap(action => {
      if (!state$.value.auth.loggedIn || !state$.value.network.isOnline) {
        return empty();
      }

      const tasklist = state$.value.taskList.currentTaskListId;

      const deleteTaskRequest$ = (task?: string) =>
        from(tasksAPI.delete({ tasklist, task })).pipe(
          map<any, TaskActions>(() => ({
            type: TaskActionTypes.DELETE_TASK_SUCCESS
          }))
        );

      const onNewTaskSuccess$ = (uuid: string) =>
        action$.pipe(
          ofType<TaskActions, NewTaskSuccess>(TaskActionTypes.NEW_TASK_SUCCESS),
          filter(success => success.payload.uuid === uuid)
        );

      const newTaskRequest$ = (
        params: tasks_v1.Params$Resource$Tasks$Insert,
        uuid: string
      ) =>
        from(tasksAPI.insert(params)).pipe(
          map(({ data }) => data),
          map<tasks_v1.Schema$Task, TaskActions>(task => ({
            type: TaskActionTypes.NEW_TASK_SUCCESS,
            payload: {
              ...task,
              uuid
            }
          }))
        );

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return from(
            tasksAPI.list({
              tasklist,
              showCompleted: true,
              showHidden: true
            })
          ).pipe(
            tap(() => nprogress.done()),
            map(({ data }) => data),
            map<tasks_v1.Schema$Tasks, TaskActions>(({ items }) => ({
              type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
              payload: items || []
            })),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.NEW_TASK:
          const { previousTask } = action.payload;
          const previous = previousTask ? previousTask.id : undefined;
          const requestBody: tasks_v1.Params$Resource$Tasks$Insert['requestBody'] = {};

          if (previousTask && previousTask.due) {
            requestBody['due'] = previousTask.due;
          }

          if (previousTask && !previousTask.id) {
            return onNewTaskSuccess$(previousTask.uuid).pipe(
              delay(250), // short delay prevent request overlap by update
              mergeMap(success =>
                newTaskRequest$(
                  { tasklist, previous: success.payload.id, requestBody },
                  action.payload.uuid
                )
              )
            );
          }

          return newTaskRequest$(
            { tasklist, previous, requestBody },
            action.payload.uuid
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload.id) {
            return onNewTaskSuccess$(action.payload.uuid).pipe(
              mergeMap(success => deleteTaskRequest$(success.payload.id!))
            );
          }

          return deleteTaskRequest$(action.payload.id);

        case TaskActionTypes.DELETE_COMPLETED_TASKS:
          return forkJoin(
            ...action.payload.map(task => deleteTaskRequest$(task.id))
          ).pipe(
            mapTo<any, TaskActions>({
              type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS
            })
          );

        default:
          return empty();
      }
    })
  );
};

const updateEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const updateTaskRequest$ = (requestBody: Schema$Task) => {
    delete requestBody.completed;
    delete requestBody.position;

    if (!requestBody.id) {
      throw new Error('update task request failed, id is missing');
    }

    return from(
      tasksAPI.update({
        tasklist: state$.value.taskList.currentTaskListId,
        task: requestBody.id,
        requestBody
      })
    ).pipe(
      map(({ data }) => data),
      map<tasks_v1.Schema$Task, UpdateTaskSuccess>(payload => ({
        type: TaskActionTypes.UPDATE_TASK_SUCCESS,
        payload
      }))
    );
  };

  const task$ = state$.pipe(map(({ task }) => task.tasks));

  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ => {
      return group$.pipe(
        debounce(action => timer(action.payload.id ? 1000 : 0)), // make this better
        distinctUntilChanged(isEqual),
        switchMap(action => {
          return task$.pipe(
            mergeMap(task => task),
            filter(task => task.uuid === action.payload.uuid),
            switchMap(() => {
              if (action.payload.id === undefined) {
                return action$.pipe(
                  ofType<TaskActions, NewTaskSuccess>(
                    TaskActionTypes.NEW_TASK_SUCCESS
                  ),
                  filter(
                    success => success.payload.uuid === action.payload.uuid
                  ),
                  switchMap(success =>
                    updateTaskRequest$({
                      ...success.payload,
                      ...action.payload
                    })
                  )
                );
              }

              return updateTaskRequest$(action.payload);
            }),
            take(1)
          );
        })
      );
    })
  );
};

const moveTaskEpic: Epic<TaskActions, TaskActions, RootState> = (
  action$,
  state$
) => {
  const todoTasks$ = state$.pipe(map(({ task }) => task.todoTasks));

  const moveTaskRequest$ = (task: Schema$Task) =>
    todoTasks$.pipe(
      mergeMap(todoTasks => from([undefined, ...todoTasks])),
      pairwise(),
      filter(([_, b]) => !!b && b.uuid === task.uuid),
      mergeMap(([previous, target]) =>
        from(
          tasksAPI.move({
            tasklist: state$.value.taskList.currentTaskListId,
            task: target!.id,
            previous: previous && previous.id
          })
        ).pipe(
          map<any, MoveTasksSuccess>(() => ({
            type: TaskActionTypes.MOVE_TASKS_SUCCESS
          }))
        )
      ),
      take(1)
    );

  return action$.pipe(
    ofType<TaskActions, MoveTasks>(TaskActionTypes.MOVE_TASKS),
    withLatestFrom(todoTasks$),
    groupBy(([action, todoTasks]) => todoTasks[action.payload.newIndex].uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounce(() => timer(500)),
        switchMap(([action, todoTasks]) => {
          const task = todoTasks[action.payload.newIndex];
          if (!task.id) {
            return action$.pipe(
              ofType<TaskActions, NewTaskSuccess>(
                TaskActionTypes.NEW_TASK_SUCCESS
              ),
              filter(success => success.payload.uuid === task.uuid),
              switchMap(success => moveTaskRequest$(success.payload))
            );
          }

          return moveTaskRequest$(task);
        })
      )
    )
  );
};

export default [apiEpic, updateEpic, moveTaskEpic];
