import { UnionCRUDActions, createCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$TaskList } from '../../typings';

export const [taskListActions, TaskListActionTypes] = createCRUDActions<
  Schema$TaskList,
  'id'
>()({
  createTaskList: ['CREATE', 'CREATE_TASK_LIST'],
  deleteTaskList: ['DELETE', 'DELETE_TASK_LIST'],
  updateTaskList: ['UPDATE', 'UPDATE_TASK_LIST'],
  paginateTaskList: ['PAGINATE', 'PAGINATE_TASK_LIST']
});

export type TaskListActions = UnionCRUDActions<typeof taskListActions>;

export const useTaskListActions = () => useActions(taskListActions);
