import { tasks_v1 } from 'googleapis';
import {
  useActions,
  getCRUDActionsCreator,
  GetCreatorsAction,
  PaginatePayload,
  UpdatePayload
} from '../../hooks/crud-reducer';
import { Schema$Task } from '../../typings';
import { taskUUID } from '../../service';

interface Payload$CreateTask extends Partial<Schema$Task> {
  prevTask?: string;
  inherit?: { uuid: string; keys: (keyof Schema$Task)[] };
}

interface Payload$MoveTask {
  to: number;
  from: number;
  uuid: string;
}

export interface Payload$MoveToAnotherList {
  tasklistId: string;
  uuid: string;
}

const [actions, actionTypes] = getCRUDActionsCreator<Schema$Task, 'uuid'>()({
  UPDATE: 'UPDATE_TASK',
  PAGINATE: 'PAGINATE_TASK'
} as const);

export const TaskActionTypes = {
  ...actionTypes,
  GET: 'GET_TASKS',
  CREATE: 'CREATE_TASK',
  CREATE_SUCCESS: 'CREATE_TASK_SUCCESS',
  DELETE: 'DELETE_TASK',
  FOCUS: 'FOCUS_TASK',
  UPDATE_SUCCESS: 'UPDATE_TASK_SUCCESS',
  MOVE_TASK: 'MOVE_TASK',
  MOVE_TASK_SUCCESS: 'MOVE_TASK_SUCCESS',
  DELETE_ALL_COMPLETED_TASKS: 'DELETE_ALL_COMPLETED_TASKS',
  DELETE_ALL_COMPLETED_TASKS_SUCCESS: 'DELETE_ALL_COMPLETED_TASKS_SUCCESS',
  SYNC: 'SYNC_TASKS',
  MOVE_TO_ANOTHER_LIST: 'MOVE_TO_ANOTHER_LIST'
} as const;

export function getTasks(payload: tasks_v1.Params$Resource$Tasks$List) {
  return {
    type: TaskActionTypes.GET,
    payload
  };
}

export function createTask(payload: Payload$CreateTask = {}) {
  return {
    type: TaskActionTypes.CREATE,
    payload: {
      uuid: taskUUID.next(),
      ...payload
    }
  };
}

export function deleteTask(payload: { uuid: string; prevTaskIndex?: number }) {
  return {
    type: TaskActionTypes.DELETE,
    payload
  };
}

export function setFocus(payload?: string | number | null) {
  return {
    type: TaskActionTypes.FOCUS,
    payload
  };
}

export function createTaskSuccess(payload: Schema$Task) {
  return {
    // ...actions.update(payload),
    type: TaskActionTypes.CREATE_SUCCESS,
    payload
  };
}

export function updateTaskSuccess(payload: UpdatePayload<Schema$Task, 'uuid'>) {
  return {
    type: TaskActionTypes.UPDATE_SUCCESS,
    payload
  };
}

export function moveTask(payload: Payload$MoveTask) {
  return {
    type: TaskActionTypes.MOVE_TASK,
    payload
  };
}

export function moveTaskSuccess() {
  return {
    type: TaskActionTypes.MOVE_TASK_SUCCESS
  };
}

export function deleteAllCompletedTasks() {
  return {
    type: TaskActionTypes.DELETE_ALL_COMPLETED_TASKS
  };
}

export function deleteAllCompletedTasksSuccess() {
  return {
    type: TaskActionTypes.DELETE_ALL_COMPLETED_TASKS_SUCCESS
  };
}

export function syncTasks(payload: PaginatePayload<Schema$Task>) {
  return { type: TaskActionTypes.SYNC, payload };
}

export function moveToAnotherList(payload: Payload$MoveToAnotherList) {
  return { type: TaskActionTypes.MOVE_TO_ANOTHER_LIST, payload };
}

export const taskActions = {
  ...actions,
  getTasks,
  createTask,
  deleteTask,
  setFocus,
  moveTask,
  deleteAllCompletedTasks,
  syncTasks,
  moveToAnotherList
};

export type TaskActions =
  | GetCreatorsAction<typeof taskActions>
  | ReturnType<typeof createTaskSuccess>
  | ReturnType<typeof updateTaskSuccess>
  | ReturnType<typeof moveTaskSuccess>
  | ReturnType<typeof deleteAllCompletedTasks>
  | ReturnType<typeof deleteAllCompletedTasksSuccess>
  | ReturnType<typeof syncTasks>
  | ReturnType<typeof moveToAnotherList>;

export const useTaskActions = () => useActions(taskActions);
