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
  NEW: 'NEW_TASK_LIST' as const
};

export function newTaskList(payload: string) {
  return { type: TaskListActionTypes.NEW, payload };
}

export const taskListActions = {
  ...actions,
  newTaskList
};

export type TaskListActions =
  | ReturnType<typeof newTaskList>
  | UnionCRUDActions<typeof taskListActions>;

export const useTaskListActions = () => useActions(taskListActions);
