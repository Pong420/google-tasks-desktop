import { tasks_v1 } from 'googleapis';
import {
  getCRUDActionsCreator,
  useActions,
  PaginatePayload,
  GetCreatorsAction
} from '../../hooks/crud-reducer';
import { Schema$TaskList } from '../../typings';

const [actions, actionTypes] = getCRUDActionsCreator<Schema$TaskList, 'id'>()({
  CREATE: 'CREATE_TASK_LIST',
  DELETE: 'DELETE_TASK_LIST',
  UPDATE: 'UPDATE_TASK_LIST',
  PAGINATE: 'PAGINATE_TASK_LIST'
} as const);

export const TaskListActionTypes = {
  ...actionTypes,
  GET: 'GET_TASKLISTS',
  NEW: 'NEW_TASK_LIST',
  DELETE_CURRENT_TASKLIST: 'DELETE_CURRENT_TASKLIST',
  SORT_BY: 'SORT_TASKLIST_BY',
  DISABLE: 'DISABLE_TASKLIST',
  SYNC: 'SYNC_TASKLIST'
} as const;

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

export function syncTaskList(payload: PaginatePayload<Schema$TaskList>) {
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
  | GetCreatorsAction<typeof taskListActions>
  | ReturnType<typeof getTaskLists>
  | ReturnType<typeof newTaskList>
  | ReturnType<typeof deleteCurrTaskList>
  | ReturnType<typeof sortTaskListBy>
  | ReturnType<typeof syncTaskList>;

export const useTaskListActions = () => useActions(taskListActions);
