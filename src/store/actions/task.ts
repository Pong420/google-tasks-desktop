import { Task } from '../../typings';

export enum TaskActionTypes {
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  TOGGLE_COMPLETE = 'TOGGLE_COMPLETE'
}

export interface AddTask {
  type: TaskActionTypes.ADD_TASK;
  payload: Task;
}

export interface UpdateTask {
  type: TaskActionTypes.UPDATE_TASK;
  payload: Task;
}

export interface DeleteTask {
  type: TaskActionTypes.DELETE_TASK;
  payload: Task;
}

export interface ToggleComplete {
  type: TaskActionTypes.TOGGLE_COMPLETE;
  payload: Task;
}

export type TaskActions = AddTask | UpdateTask | DeleteTask | ToggleComplete;

export const TaskActionCreators = {
  addTask(payload: Task): AddTask {
    return {
      type: TaskActionTypes.ADD_TASK,
      payload
    };
  },
  updateTask(payload: Task): UpdateTask {
    return {
      type: TaskActionTypes.UPDATE_TASK,
      payload
    };
  },
  deleteTask(payload: Task): DeleteTask {
    return {
      type: TaskActionTypes.DELETE_TASK,
      payload
    };
  },
  toggleComplete(payload: Task): ToggleComplete {
    return {
      type: TaskActionTypes.TOGGLE_COMPLETE,
      payload
    };
  }
};
