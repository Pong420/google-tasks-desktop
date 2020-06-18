import { UnionCRUDActions, createCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$TaskList } from '../../typings';

const [actions, actionTypes] = createCRUDActions<Schema$TaskList, 'id'>()({
  createTaskList: ['CREATE', 'CREATE_TASK_LIST'],
  deleteTaskList: ['DELETE', 'DELETE_TASK_LIST'],
  updateTaskList: ['UPDATE', 'UPDATE_TASK_LIST'],
  paginateTaskList: ['PAGINATE', 'PAGINATE_TASK_LIST']
});

export const TaskListActionTypes = {
  ...actionTypes,
  NEW: 'NEW_TASK_LIST' as const,
  DELETE_CURRENT_TASKLIST: 'DELETE_CURRENT_TASKLIST' as const,
  SORT_BY: 'SORT_TASKLIST_BY' as const
};

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

export const taskListActions = {
  ...actions,
  newTaskList,
  deleteCurrTaskList,
  sortTaskListBy
};

export type TaskListActions =
  | UnionCRUDActions<typeof taskListActions>
  | ReturnType<typeof newTaskList>
  | ReturnType<typeof deleteCurrTaskList>
  | ReturnType<typeof sortTaskListBy>;

export const useTaskListActions = () => useActions(taskListActions);
