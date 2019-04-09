import { Task } from '../../typings';

export enum TaskActionTypes {
  ADD_TASK = 'ADD_TASK',
  ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS',
  UPDATE_TASK = 'UPDATE_TASK',
  UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
  DELETE_TASK = 'DELETE_TASK',
  DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
  TOGGLE_COMPLETE = 'TOGGLE_COMPLETE',
  TOGGLE_COMPLETE_SUCCESS = 'TOGGLE_COMPLETE_SUCCESS'
}

export interface AddTask {
  type: TaskActionTypes.ADD_TASK;
  payload: Task;
}

export interface AddTaskSuccess {
  type: TaskActionTypes.ADD_TASK_SUCCESS;
  payload: Task;
}

export interface UpdateTask {
  type: TaskActionTypes.UPDATE_TASK;
  payload: Task;
}

export interface UpdateTaskSuccess {
  type: TaskActionTypes.UPDATE_TASK_SUCCESS;
  payload: Task;
}

export interface DeleteTask {
  type: TaskActionTypes.DELETE_TASK;
  payload: Task;
}

export interface DeleteTaskSuccess {
  type: TaskActionTypes.DELETE_TASK_SUCCESS;
  payload: Task;
}

export interface ToggleComplete {
  type: TaskActionTypes.TOGGLE_COMPLETE;
  payload: Task;
}

export interface ToggleCompleteSuccess {
  type: TaskActionTypes.TOGGLE_COMPLETE_SUCCESS;
  payload: Task;
}

export type TaskActions =
  | AddTask
  | AddTaskSuccess
  | UpdateTask
  | UpdateTaskSuccess
  | DeleteTask
  | DeleteTaskSuccess
  | ToggleComplete
  | ToggleCompleteSuccess;

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
