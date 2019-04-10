import { tasks_v1 } from 'googleapis';

export enum TaskActionTypes {
  GET_ALL_TASKS = 'GET_ALL_TASKS',
  GET_ALL_TASKS_SUCCESS = 'GET_ALL_TASKS_SUCCESS',
  ADD_TASK = 'ADD_TASK',
  ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS',
  UPDATE_TASK = 'UPDATE_TASK',
  UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
  DELETE_TASK = 'DELETE_TASK',
  DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
  MOVE_TASK = 'MOVE_TASK',
  MOVE_TASK_SUCCESS = 'MOVE_TASK_SUCCESS',
  CLEAR_COMPLETED_TASKS = 'CLEAR_COMPLETED_TASKS',
  CLEAR_COMPLETED_TASKS_SUCCESS = 'CLEAR_COMPLETED_TASKS_SUCCESS'
}

export interface GetAllTasks {
  type: TaskActionTypes.GET_ALL_TASKS;
  payload: tasks_v1.Params$Resource$Tasks$List;
}

export interface GetAllTasksSuccess {
  type: TaskActionTypes.GET_ALL_TASKS_SUCCESS;
  payload: tasks_v1.Schema$Task[];
}

export interface AddTask {
  type: TaskActionTypes.ADD_TASK;
}

export interface AddTaskSuccess {
  type: TaskActionTypes.ADD_TASK_SUCCESS;
}

export interface UpdateTask {
  type: TaskActionTypes.UPDATE_TASK;
}

export interface UpdateTaskSuccess {
  type: TaskActionTypes.UPDATE_TASK_SUCCESS;
}

export interface DeleteTask {
  type: TaskActionTypes.DELETE_TASK;
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

export interface ClearCompletedTasks {
  type: TaskActionTypes.CLEAR_COMPLETED_TASKS;
}

export interface ClearCompletedTasksSuccess {
  type: TaskActionTypes.CLEAR_COMPLETED_TASKS_SUCCESS;
}

export type TaskActions =
  | GetAllTasks
  | GetAllTasksSuccess
  | AddTask
  | AddTaskSuccess
  | UpdateTask
  | UpdateTaskSuccess
  | DeleteTask
  | DeleteTaskSuccess
  | MoveTask
  | MoveTaskSuccess
  | ClearCompletedTasks
  | ClearCompletedTasksSuccess;

export const TaskActionCreators = {
  getAllTasks(payload: tasks_v1.Params$Resource$Tasks$List): GetAllTasks {
    return {
      type: TaskActionTypes.GET_ALL_TASKS,
      payload
    };
  }
};
