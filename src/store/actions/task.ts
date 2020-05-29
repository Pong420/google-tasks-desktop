import { UnionCRUDActions, createCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$Task } from '../../typings';
import { taskUUID } from '../../service';

export interface Payload$MoveTask {
  to: number;
  from: number;
  uuid: string;
}

export const [actions, actionTypes] = createCRUDActions<Schema$Task, 'uuid'>()({
  updateTask: ['UPDATE', 'UPDATE_TASK'],
  paginateTask: ['PAGINATE', 'PAGINATE_TASK']
});

export const TaskActionTypes = {
  ...actionTypes,
  CREATE: 'CREATE_TASK' as const,
  CREATE_SUCCESS: 'CREATE_TASK_SUCCESS' as const,
  DELETE: 'DELETE_TASK' as const,
  FOCUS: 'FOCUS_TASK' as const,
  UPDATE_SUCCESS: 'UPDATE_TASK_SUCCESS' as const,
  MOVE_TASK: 'MOVE_TASK' as const,
  MOVE_TASK_SUCCESS: 'MOVE_TASK_SUCCESS' as const,
  DELETE_ALL_COMPLETED_TASKS: 'DELETE_ALL_COMPLETED_TASKS' as const,
  DELETE_ALL_COMPLETED_TASKS_SUCCESS: 'DELETE_ALL_COMPLETED_TASKS_SUCCESS' as const
};

export function createTask(
  payload: { prevTask?: string } & Partial<Schema$Task> = {}
) {
  return {
    type: TaskActionTypes.CREATE,
    sub: 'CREATE' as const,
    payload: {
      uuid: taskUUID.next(),
      ...payload
    }
  };
}

export function deleteTask(payload: { uuid: string; prevTaskIndex?: number }) {
  return {
    type: TaskActionTypes.DELETE,
    sub: 'DELETE' as const,
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
    ...actions.updateTask(payload),
    payload,
    type: TaskActionTypes.CREATE_SUCCESS
  };
}

export function updateTaskSuccess(
  ...args: Parameters<typeof actions['updateTask']>
) {
  return {
    ...actions.updateTask(...args),
    type: TaskActionTypes.UPDATE_SUCCESS
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

export const taskActions = {
  ...actions,
  createTask,
  deleteTask,
  setFocus,
  moveTask,
  deleteAllCompletedTasks
};

export type TaskActions =
  | UnionCRUDActions<typeof taskActions>
  | ReturnType<typeof createTaskSuccess>
  | ReturnType<typeof updateTaskSuccess>
  | ReturnType<typeof moveTaskSuccess>
  | ReturnType<typeof deleteAllCompletedTasks>
  | ReturnType<typeof deleteAllCompletedTasksSuccess>;

export const useTaskActions = () => useActions(taskActions);
