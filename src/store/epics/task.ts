import { empty, from } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  pairwise,
  withLatestFrom,
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
  MoveTaskSuccess,
  NewTask
} from '../actions/task';
import { RootState } from '../reducers';
import { tasksAPI } from '../../api';
import { EpicDependencies } from '../epicDependencies';
import { Schema$Task } from '../../typings';
import isEqual from 'lodash/fp/isEqual';

type TaskEpic = Epic<TaskActions, TaskActions, RootState, EpicDependencies>;

const onNewTaskSuccess$ = (
  action$: ActionsObservable<TaskActions>,
  uuid: string
) =>
  action$.pipe(
    ofType<TaskActions, NewTaskSuccess>(TaskActionTypes.NEW_TASK_SUCCESS),
    filter(success => success.payload.uuid === uuid)
  );

const apiEpic: TaskEpic = (
  action$,
  state$,
  { nprogress, withNetworkHelper }
) => {
  return action$.pipe(
    filter(action => !/Update|Move|New/i.test(action.type)),
    withNetworkHelper(state$),
    mergeMap(action => {
      const tasklist = state$.value.taskList.currentTaskListId;

      const deleteTaskRequest$ = (task?: string) =>
        from(tasksAPI.delete({ tasklist, task })).pipe(
          map<any, TaskActions>(() => ({
            type: TaskActionTypes.DELETE_TASK_SUCCESS
          }))
        );

      switch (action.type) {
        case TaskActionTypes.GET_ALL_TASKS:
          nprogress.inc(0.4);

          return from(
            tasksAPI.list({
              tasklist,
              showCompleted: true,
              showHidden: false
            })
          ).pipe(
            tap(() => nprogress.done()),
            map(({ data }) => data.items),
            map<tasks_v1.Schema$Tasks['items'], TaskActions>(
              (payload = []) => ({
                type: TaskActionTypes.GET_ALL_TASKS_SUCCESS,
                payload
              })
            ),
            takeUntil(action$.pipe(ofType(TaskActionTypes.GET_ALL_TASKS)))
          );

        case TaskActionTypes.DELETE_TASK:
          if (!action.payload.id) {
            return onNewTaskSuccess$(action$, action.payload.uuid).pipe(
              switchMap(success => deleteTaskRequest$(success.payload.id!))
            );
          }

          return deleteTaskRequest$(action.payload.id);

        case TaskActionTypes.DELETE_COMPLETED_TASKS:
          return from(
            tasksAPI.clear({
              tasklist
            })
          ).pipe(
            map<any, TaskActions>(() => ({
              type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS
            }))
          );

        default:
          return empty();
      }
    })
  );
};

const newTaskEpic: TaskEpic = (action$, state$, { withNetworkHelper }) => {
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

  return action$.pipe(
    ofType<TaskActions, NewTask>(TaskActionTypes.NEW_TASK),
    withNetworkHelper(state$),
    mergeMap(action => {
      const tasklist = state$.value.taskList.currentTaskListId;
      const { previousTask, ...newTask } = action.payload;
      const previous = previousTask ? previousTask.id : undefined;

      if (previousTask && !previousTask.id) {
        return onNewTaskSuccess$(action$, previousTask.uuid).pipe(
          switchMap(success =>
            newTaskRequest$(
              {
                tasklist,
                previous: success.payload.id,
                requestBody: newTask
              },
              action.payload.uuid
            )
          )
        );
      }

      return newTaskRequest$(
        { tasklist, previous, requestBody: newTask },
        action.payload.uuid
      );
    })
  );
};

const updateEpic: TaskEpic = (action$, state$, { withNetworkHelper }) => {
  const updateTaskRequest$ = (requestBody: Schema$Task) => {
    delete requestBody.completed;
    delete requestBody.position;
    delete requestBody.updated;

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

  return action$.pipe(
    ofType<TaskActions, UpdateTask>(TaskActionTypes.UPDATE_TASK),
    withNetworkHelper(state$),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ => {
      return group$.pipe(
        debounceTime(1000),
        distinctUntilChanged(isEqual),
        switchMap(action => {
          const exsits = state$.value.task.tasks.find(
            task => task.uuid === action.payload.uuid
          );

          if (exsits) {
            if (exsits.id) {
              return updateTaskRequest$({
                ...exsits,
                ...action.payload
              });
            }

            return onNewTaskSuccess$(action$, action.payload.uuid).pipe(
              switchMap(success => {
                return updateTaskRequest$({
                  ...success.payload,
                  ...action.payload
                });
              })
            );
          }

          return empty();
        })
      );
    })
  );
};

const moveTaskEpic: TaskEpic = (action$, state$, { withNetworkHelper }) => {
  const todoTasks$ = state$.pipe(map(({ task }) => task.todoTasks));

  const moveTaskRequest$ = (task: Schema$Task) =>
    todoTasks$.pipe(
      mergeMap(todoTasks => from([undefined, ...todoTasks])),
      pairwise(),
      filter(([_, b]) => !!b && b.uuid === task.uuid),
      switchMap(([previous, target]) =>
        from(
          tasksAPI.move({
            tasklist: state$.value.taskList.currentTaskListId,
            task: target!.id,
            previous: previous && previous.id
          })
        ).pipe(
          map<any, MoveTaskSuccess>(() => ({
            type: TaskActionTypes.MOVE_TASKS_SUCCESS
          }))
        )
      ),
      take(1)
    );

  return action$.pipe(
    ofType<TaskActions, MoveTask>(TaskActionTypes.MOVE_TASKS),
    withNetworkHelper(state$),
    withLatestFrom(todoTasks$),
    groupBy(([action, todoTasks]) => todoTasks[action.payload.newIndex].uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(500),
        switchMap(([action, todoTasks]) => {
          const task = todoTasks[action.payload.newIndex];
          if (!task.id) {
            return onNewTaskSuccess$(action$, task.uuid).pipe(
              switchMap(success => moveTaskRequest$(success.payload))
            );
          }

          return moveTaskRequest$(task);
        })
      )
    )
  );
};

export default [apiEpic, newTaskEpic, updateEpic, moveTaskEpic];
