import { tasks_v1 } from 'googleapis';
import { SortEnd } from 'react-sortable-hoc';
import { Schema$Task } from '../../typings';
import uuid from 'uuid';

export enum TaskActionTypes {
  GET_ALL_TASKS = 'GET_ALL_TASKS',
  GET_ALL_TASKS_SUCCESS = 'GET_ALL_TASKS_SUCCESS',
  NEW_TASK = 'NEW_TASK',
  NEW_TASK_SUCCESS = 'NEW_TASK_SUCCESS',
  UPDATE_TASK = 'UPDATE_TASK',
  UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
  DELETE_TASK = 'DELETE_TASK',
  DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
  MOVE_TASK = 'MOVE_TASK',
  MOVE_TASK_SUCCESS = 'MOVE_TASK_SUCCESS',
  DELETE_COMPLETED_TASKS = 'DELETE_COMPLETED_TASKS',
  DELETE_COMPLETED_TASKS_SUCCESS = 'DELETE_COMPLETED_TASKS_SUCCESS',
  MOVE_TASKS = 'MOVE_TASKS',
  MOVE_TASKS_SUCCESS = 'MOVE_TASKS_SUCCESS'
}

export interface Payload$Optional$NewTask {
  insertAfter?: number;
}

export interface Payload$NewTask extends Payload$Optional$NewTask {
  uuid: string;
}

export type Payload$SortTasks = 'order' | 'date';

export interface GetAllTasks {
  type: TaskActionTypes.GET_ALL_TASKS;
}

export interface GetAllTasksSuccess {
  type: TaskActionTypes.GET_ALL_TASKS_SUCCESS;
  payload: tasks_v1.Schema$Task[];
}

export interface NewTask {
  type: TaskActionTypes.NEW_TASK;
  payload: Payload$NewTask;
}

export interface NewTaskSuccess {
  type: TaskActionTypes.NEW_TASK_SUCCESS;
  payload: Schema$Task;
}

export interface UpdateTask {
  type: TaskActionTypes.UPDATE_TASK;
  payload: Schema$Task;
}

export interface UpdateTaskSuccess {
  type: TaskActionTypes.UPDATE_TASK_SUCCESS;
  payload: tasks_v1.Schema$Task;
}

export interface DeleteTask {
  type: TaskActionTypes.DELETE_TASK;
  payload: Schema$Task;
}

export interface DeleteTaskSuccess {
  type: TaskActionTypes.DELETE_TASK_SUCCESS;
}

export interface MoveTask {
  type: TaskActionTypes.MOVE_TASK;
}

export interface MoveTaskSuccess {
  type: TaskActionTypes.MOVE_TASK_SUCCESS;
}

export interface DeleteCompletedTasks {
  type: TaskActionTypes.DELETE_COMPLETED_TASKS;
  payload: Schema$Task[];
}

export interface DeleteCompletedTasksSuccess {
  type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS;
}

export interface MoveTasks {
  type: TaskActionTypes.MOVE_TASKS;
  payload: Pick<SortEnd, 'newIndex' | 'oldIndex'>;
}

export interface MoveTasksSuccess {
  type: TaskActionTypes.MOVE_TASKS_SUCCESS;
}

export type TaskActions =
  | GetAllTasks
  | GetAllTasksSuccess
  | NewTask
  | NewTaskSuccess
  | UpdateTask
  | UpdateTaskSuccess
  | DeleteTask
  | DeleteTaskSuccess
  | MoveTask
  | MoveTaskSuccess
  | DeleteCompletedTasks
  | DeleteCompletedTasksSuccess
  | MoveTasks
  | MoveTasksSuccess;

export const TaskActionCreators = {
  getAllTasks(): GetAllTasks {
    return {
      type: TaskActionTypes.GET_ALL_TASKS
    };
  },
  newTask(payload?: Payload$Optional$NewTask): NewTask {
    return {
      type: TaskActionTypes.NEW_TASK,
      payload: {
        ...payload,
        uuid: uuid.v4()
      }
    };
  },
  deleteTask(payload: Schema$Task): DeleteTask {
    return {
      type: TaskActionTypes.DELETE_TASK,
      payload
    };
  },
  updateTask(payload: Schema$Task): UpdateTask {
    return {
      type: TaskActionTypes.UPDATE_TASK,
      payload
    };
  },
  deleteCompletedTasks(payload: Schema$Task[]): DeleteCompletedTasks {
    return {
      type: TaskActionTypes.DELETE_COMPLETED_TASKS,
      payload
    };
  },
  moveTask(payload: Pick<SortEnd, 'newIndex' | 'oldIndex'>) {
    return {
      type: TaskActionTypes.MOVE_TASKS,
      payload
    };
  }
};
