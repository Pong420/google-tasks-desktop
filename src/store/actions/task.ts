import { UnionCRUDActions, createCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$Task } from '../../typings';
import { taskUUID } from '../../service';

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
  UPDATE_SUCCESS: 'UPDATE_TASK_SUCCESS' as const
};

export function createTask(payload?: { prevTask?: string }) {
  return {
    type: TaskActionTypes.CREATE,
    payload: {
      ...payload,
      uuid: taskUUID.next()
    }
  };
}

export function deleteTask(payload: { uuid: string; prevTask?: string }) {
  return {
    type: TaskActionTypes.DELETE,
    sub: 'DELETE' as const,
    payload
  };
}

export function setFocus(payload?: string | null) {
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

export const taskActions = {
  ...actions,
  createTask,
  deleteTask,
  setFocus
};

export type TaskActions =
  | UnionCRUDActions<typeof taskActions>
  | ReturnType<typeof createTaskSuccess>
  | ReturnType<typeof updateTaskSuccess>;

export const useTaskActions = () => useActions(taskActions);
