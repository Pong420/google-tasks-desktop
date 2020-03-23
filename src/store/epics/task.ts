import { ofType, Epic, ActionsObservable } from 'redux-observable';
import { Observable, empty, defer, of } from 'rxjs';
import {
  switchMap,
  mergeMap,
  map,
  filter,
  catchError,
  groupBy,
  debounceTime,
  takeUntil,
  shareReplay,
  take,
  tap
} from 'rxjs/operators';
import {
  TaskActions,
  createTaskSuccess,
  updateTaskSuccess
} from '../actions/task';
import { RootState } from '../reducers';
import { taskSelector, currentTaskListsSelector } from '../selectors';
import { tasksAPI } from '../../service';
import { ExtractAction, Schema$Task } from '../../typings';
import NProgress from '../../utils/nprogress';

type Actions = TaskActions;
type TaskEpic = Epic<Actions, Actions, RootState>;

const waitForTaskCreated$ = (
  action$: ActionsObservable<Actions>,
  uuid: string
): Observable<Schema$Task> =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'CREATE_TASK_SUCCESS'>>(
      'CREATE_TASK_SUCCESS'
    ),
    filter(action => action.payload.uuid === uuid),
    map(action => action.payload),
    take(1)
  );

const deleteTask$ = (
  action$: ActionsObservable<Actions>,
  uuid: string
): Observable<ExtractAction<Actions, 'DELETE_TASK'>> =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'DELETE_TASK'>>('DELETE_TASK'),
    filter(action => action.payload.uuid === uuid),
    take(1)
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
          : waitForTaskCreated$(action$, prevTask.uuid);

      const createTask$ = prevTask$.pipe(
        switchMap(prevTask =>
          defer(() =>
            tasksAPI.insert({
              previous: prevTask && prevTask.id!,
              tasklist: tasklist && tasklist.id!
            })
          )
        ),
        map(res => res.data),
        shareReplay(1)
      );

      return createTask$.pipe(
        mergeMap(task => of(createTaskSuccess({ ...task, uuid }))),
        takeUntil(
          deleteTask$(action$, uuid).pipe(
            tap(action => {
              if (action.type === 'DELETE_TASK') {
                createTask$.subscribe(task =>
                  tasksAPI.delete({
                    task: task.id!,
                    tasklist: tasklist && tasklist.id
                  })
                );
              }
            })
          )
        )
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
            task && task.id ? of(task) : waitForTaskCreated$(action$, uuid);
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
        }),
        takeUntil(deleteTask$(action$, group$.key))
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
        : waitForTaskCreated$(action$, uuid)
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
