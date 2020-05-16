import { ofType, Epic, ActionsObservable } from 'redux-observable';
import { Observable, empty, defer, of, forkJoin } from 'rxjs';
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
  updateTaskSuccess,
  moveTaskSuccess
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

const moveTaskEpic: TaskEpic = (action$, state$) => {
  return action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'MOVE_TASK'>>('MOVE_TASK'),
    groupBy(action => action.payload.from),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(500),
        switchMap((action: ExtractAction<Actions, 'MOVE_TASK'>) => {
          const { byIds } = state$.value.task;
          const tasklist = currentTaskListsSelector(state$.value);
          const payload = [action.payload.prevUUID, action.payload.from].map(
            uuid => {
              const task = uuid && byIds[uuid];
              if (task) {
                return task.id
                  ? of(task)
                  : waitForTaskCreated$(action$, task.uuid);
              }
              return of(undefined);
            }
          ) as [any, any];

          return forkJoin<Schema$Task | undefined>(...payload).pipe(
            mergeMap(([prevTask, currTask]) => {
              const taskId = currTask && currTask.id;
              const prevId = prevTask && prevTask.id;

              // currTask may be delete before successful loaded
              if (taskId) {
                return defer(() =>
                  tasksAPI.move({
                    task: taskId,
                    previous: prevId || undefined,
                    tasklist: tasklist && tasklist.id
                  })
                ).pipe(
                  //
                  map(moveTaskSuccess)
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

export default [
  nprogressEpic,
  createTaskEpic,
  updateTaskEpic,
  deleteTaskEpic,
  moveTaskEpic
];
