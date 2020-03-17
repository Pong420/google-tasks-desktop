import { ofType, Epic, StateObservable } from 'redux-observable';
import { empty, defer, of } from 'rxjs';
import {
  switchMap,
  mergeMap,
  map,
  filter,
  distinctUntilKeyChanged,
  catchError,
  groupBy,
  debounceTime
} from 'rxjs/operators';
import { TaskActions, updateTaskSuccess } from '../actions/task';
import { RootState } from '../reducers';
import { currentTaskListsSelector, taskSelector } from '../selectors';
import { tasksAPI } from '../../service';
import { ExtractAction, Schema$Task } from '../../typings';
import NProgress from '../../utils/nprogress';

type Actions = TaskActions;
type TaskEpic = Epic<Actions, Actions, RootState>;

const waitForTaskCreated$ = (
  state$: StateObservable<RootState>,
  uuid: string
) =>
  state$.pipe(
    map(state => state.task.byIds[uuid]),
    filter((task): task is Schema$Task => !!task && !!task.id),
    distinctUntilKeyChanged('id')
  );

const nprogressEpic: TaskEpic = action$ =>
  action$.pipe(
    ofType('PAGINATE_TASK'),
    switchMap(() => {
      NProgress.done();
      return empty();
    })
  );

const createTaskEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'CREATE_TASK'>>('CREATE_TASK'),
    mergeMap(action => {
      const { prevTask: prevTaskUUID, uuid } = action.payload;
      const tasklist = currentTaskListsSelector(state$.value);
      const prevTask = prevTaskUUID
        ? taskSelector(prevTaskUUID)(state$.value)
        : undefined;
      const prevTask$ =
        !prevTask || prevTask.id
          ? of(prevTask)
          : waitForTaskCreated$(state$, prevTask.uuid);

      return defer(() =>
        prevTask$.pipe(
          switchMap(prevTask =>
            tasksAPI.insert({
              previous: prevTask && prevTask.id!,
              tasklist: tasklist && tasklist.id!
            })
          )
        )
      ).pipe(
        map(res => res.data),
        map(task => updateTaskSuccess({ ...task, uuid }))
      );
    })
  );

const updateTaskEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'UPDATE_TASK'>>('UPDATE_TASK'),
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(250),
        switchMap(action => {
          const { uuid, ...changes } = action.payload;
          const tasklist = currentTaskListsSelector(state$.value)!;
          const task = state$.value.task.byIds[uuid];
          const task$ =
            task && task.id ? of(task) : waitForTaskCreated$(state$, uuid);

          return task$.pipe(
            switchMap(task =>
              defer(() =>
                tasksAPI.update({
                  task: task.id!,
                  tasklist: tasklist.id!,
                  requestBody: task
                })
              ).pipe(
                map(res => res.data),
                map(task => updateTaskSuccess({ ...task, ...changes, uuid })),
                catchError(() => empty())
              )
            )
          );
        })
      )
    )
  );

const deleteTaskEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'DELETE_TASK'>>('DELETE_TASK'),
    mergeMap(action => {
      const { uuid } = action.payload;
      const task = state$.value.task.deleted[uuid];
      const tasklist = currentTaskListsSelector(state$.value);

      return (task && task.id
        ? of(task)
        : waitForTaskCreated$(state$, uuid)
      ).pipe(
        switchMap(task =>
          defer(() =>
            tasksAPI.delete({
              task: task.id!,
              tasklist: tasklist && tasklist.id
            })
          ).pipe(mergeMap(() => empty()))
        )
      );
    })
  );

export default [nprogressEpic, createTaskEpic, updateTaskEpic, deleteTaskEpic];
