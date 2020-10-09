import {
  UnionCRUDActions,
  createCRUDActions,
  PagePayload
} from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$TaskList } from '../../typings';
import { tasks_v1 } from 'googleapis';

const [actions, actionTypes] = createCRUDActions<Schema$TaskList, 'id'>()({
  createTaskList: ['CREATE', 'CREATE_TASK_LIST'],
  deleteTaskList: ['DELETE', 'DELETE_TASK_LIST'],
  updateTaskList: ['UPDATE', 'UPDATE_TASK_LIST'],
  paginateTaskList: ['PAGINATE', 'PAGINATE_TASK_LIST']
});

export const TaskListActionTypes = {
  ...actionTypes,
  GET: 'GET_TASKLISTS' as const,
  NEW: 'NEW_TASK_LIST' as const,
  DELETE_CURRENT_TASKLIST: 'DELETE_CURRENT_TASKLIST' as const,
  SORT_BY: 'SORT_TASKLIST_BY' as const,
  DISABLE: 'DISABLE_TASKLIST' as const,
  SYNC: 'SYNC_TASKLIST' as const
};

export function getTaskLists(
  payload?: tasks_v1.Params$Resource$Tasklists$List
) {
  return { type: TaskListActionTypes.GET, payload };
}

export function newTaskList(payload: string) {
  return { type: TaskListActionTypes.NEW, payload };
}

export function deleteCurrTaskList() {
  return { type: TaskListActionTypes.DELETE_CURRENT_TASKLIST };
}

export function sortTaskListBy(payload: {
  id: string;
  orderType: 'order' | 'date';
}) {
  return { type: TaskListActionTypes.SORT_BY, payload };
}

export function syncTaskList(payload: PagePayload<Schema$TaskList>) {
  return { type: TaskListActionTypes.SYNC, payload };
}

export const taskListActions = {
  ...actions,
  getTaskLists,
  newTaskList,
  deleteCurrTaskList,
  sortTaskListBy
};

export type TaskListActions =
  | UnionCRUDActions<typeof taskListActions>
  | ReturnType<typeof getTaskLists>
  | ReturnType<typeof newTaskList>
  | ReturnType<typeof deleteCurrTaskList>
  | ReturnType<typeof sortTaskListBy>
  | ReturnType<typeof syncTaskList>;

export const useTaskListActions = () => useActions(taskListActions);
