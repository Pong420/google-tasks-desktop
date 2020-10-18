import { ofType, Epic, ActionsObservable } from 'redux-observable';
import { RouterAction } from 'connected-react-router';
import { Observable, empty, defer, of, forkJoin, from, concat } from 'rxjs';
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
  tap,
  concatMap,
  retry
} from 'rxjs/operators';
import {
  TaskActions,
  createTaskSuccess,
  updateTaskSuccess,
  moveTaskSuccess,
  deleteAllCompletedTasksSuccess,
  taskActions
} from '../actions/task';
import { RootState } from '../reducers';
import { taskSelector, currentTaskListsSelector } from '../selectors';
import { tasksAPI, getAllTasks } from '../../service';
import { ExtractAction, Schema$Task } from '../../typings';
import { NProgress } from '../../utils/nprogress';

type Actions = TaskActions | RouterAction;
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

const getTasksEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'GET_TASKS'>>('GET_TASKS'),
    switchMap(action => {
      NProgress.start();
      const max = state$.value.preferences.maxTasks;
      return getAllTasks({
        ...action.payload,
        maxResults: String(max)
      }).pipe(
        map(payload => taskActions.paginate(payload)),
        tap(() => NProgress.done())
      );
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

      const { uuid: ignore, ...requestBody } =
        taskSelector(uuid)(state$.value) || {};

      const createTask$ = prevTask$.pipe(
        switchMap(prevTask =>
          defer(() =>
            tasksAPI.insert({
              previous: prevTask && prevTask.id!,
              tasklist: tasklist && tasklist.id!,
              requestBody
            })
          )
        ),
        map(res => res.data),
        shareReplay(1)
      );

      return createTask$.pipe(
        map(task => createTaskSuccess({ ...task, uuid })),
        takeUntil(
          deleteTask$(action$, uuid).pipe(
            tap(() => {
              createTask$.subscribe(task =>
                tasksAPI.delete({
                  task: task.id!,
                  tasklist: tasklist && tasklist.id
                })
              );
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
          const task = taskSelector(uuid)(state$.value);
          const task$ =
            task && task.id ? of(task) : waitForTaskCreated$(action$, uuid);

          const patchUpdate$ = task$.pipe(
            switchMap(task =>
              defer(() =>
                tasksAPI.patch({
                  task: task.id!,
                  tasklist: tasklist.id!,
                  requestBody: changes
                })
              ).pipe(
                map(res => res.data),
                catchError(() => empty())
              )
            ),
            shareReplay(1)
          );

          return patchUpdate$.pipe(
            map(task => updateTaskSuccess({ ...task, ...changes, uuid })),
            takeUntil(
              deleteTask$(action$, group$.key).pipe(
                tap(() => {
                  // patch update will create a new task if task is not exits
                  patchUpdate$.subscribe(task =>
                    tasksAPI.delete({
                      task: task.id!,
                      tasklist: tasklist && tasklist.id
                    })
                  );
                })
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
    groupBy(action => action.payload.uuid),
    mergeMap(group$ =>
      group$.pipe(
        debounceTime(500),
        switchMap((action: ExtractAction<Actions, 'MOVE_TASK'>) => {
          const tasklist = currentTaskListsSelector(state$.value);
          const index = action.payload.to;
          const todo = state$.value.task.todo.ids;
          const payload = [todo[index - 1], todo[index]].map(uuid => {
            const task = uuid && taskSelector(uuid)(state$.value);
            if (task) {
              return task.id
                ? of(task)
                : waitForTaskCreated$(action$, task.uuid);
            }
            return of(undefined);
          }) as [any, any];

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

const deleteCompletedTasksEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'DELETE_ALL_COMPLETED_TASKS'>>(
      'DELETE_ALL_COMPLETED_TASKS'
    ),
    switchMap(() => {
      const tasklist = currentTaskListsSelector(state$.value);
      const completedTasks = state$.value.task.completed.list;
      if (tasklist) {
        return from(completedTasks).pipe(
          concatMap(task =>
            defer(() =>
              tasksAPI.delete({ task: task.id!, tasklist: tasklist.id })
            ).pipe(
              retry(1),
              catchError(() => of([]))
            )
          ),
          map(() => deleteAllCompletedTasksSuccess())
        );
      }
      return empty();
    })
  );

const moveToAnotherListEpic: TaskEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, ExtractAction<Actions, 'MOVE_TO_ANOTHER_LIST'>>(
      'MOVE_TO_ANOTHER_LIST'
    ),
    switchMap(action => {
      const tasklist = currentTaskListsSelector(state$.value);
      const task = state$.value.task.deleted[action.payload.uuid];
      if (tasklist && task && task.id) {
        const { uuid, ...requestBody } = task;

        const newTask$ = defer(() =>
          tasksAPI.insert({
            tasklist: action.payload.tasklistId,
            requestBody
          })
        );

        const deleteTask$ = defer(() =>
          tasksAPI.delete({
            task: task.id!,
            tasklist: tasklist.id
          })
        );

        concat(newTask$, deleteTask$).subscribe();
      } else {
        console.warn(
          'Cannot move task to anthor list',
          !!tasklist,
          !!task,
          !!task.id
        );
      }
      return empty();
    })
  );

export default [
  nprogressEpic,
  getTasksEpic,
  createTaskEpic,
  updateTaskEpic,
  deleteTaskEpic,
  moveTaskEpic,
  deleteCompletedTasksEpic,
  moveToAnotherListEpic
];
