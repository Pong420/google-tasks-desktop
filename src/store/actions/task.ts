import { UnionCRUDActions, createCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';
import { Schema$Task } from '../../typings';

export const [taskActions, TaskActionTypes] = createCRUDActions<
  Schema$Task,
  'uuid'
>()({
  createTask: ['CREATE', 'CREATE_TASK'],
  deleteTask: ['DELETE', 'DELETE_TASK'],
  updateTask: ['UPDATE', 'UPDATE_TASK'],
  paginateTask: ['PAGINATE', 'PAGINATE_TASK']
});

export type TaskActions = UnionCRUDActions<typeof taskActions>;

export const useTaskActions = () => useActions(taskActions);
