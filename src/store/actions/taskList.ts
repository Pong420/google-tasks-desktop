import { tasks_v1 } from 'googleapis';
import { Schema$TaskList } from '../../typings';

interface TaskListAPIParams {
  tasklist: string;
}

export enum TaskListActionTypes {
  GET_ALL_TASK_LIST = 'GET_ALL_TASK_LIST',
  GET_ALL_TASK_LIST_SUCCESS = 'GET_ALL_TASK_LIST_SUCCESS',
  GET_TASK_LIST = 'GET_TASK_LIST',
  GET_TASK_LIST_SUCCESS = 'GET_TASK_LIST_SUCCESS',
  NEW_TASK_LIST = 'NEW_TASK_LIST',
  NEW_TASK_LIST_SUCCESS = 'NEW_TASK_LIST_SUCCESS',
  UPDATE_TASK_LIST = 'UPDATE_TASK_LIST',
  UPDATE_TASK_LIST_SUCCESS = 'UPDATE_TASK_LIST_SUCCESS',
  DELETE_TASK_LIST = 'DELETE_TASK_LIST',
  DELETE_TASK_LIST_SUCCESS = 'DELETE_TASK_LIST_SUCCESS',
  TOGGLE_SORT_BY_DATE = 'TOGGLE_SORT_BY_DATE'
}

export interface GetAllTaskList {
  type: TaskListActionTypes.GET_ALL_TASK_LIST;
}

export interface GetAllTaskListSuccess {
  type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS;
  payload: tasks_v1.Schema$TaskList[];
}

export interface GetTaskList {
  type: TaskListActionTypes.GET_TASK_LIST;
  payload: TaskListAPIParams;
}

export interface GetTaskListSuccess {
  type: TaskListActionTypes.GET_TASK_LIST_SUCCESS;
}

export interface NewTaskList {
  type: TaskListActionTypes.NEW_TASK_LIST;
  payload: tasks_v1.Params$Resource$Tasklists$Insert;
}

export interface NewTaskListSuccess {
  type: TaskListActionTypes.NEW_TASK_LIST_SUCCESS;
  payload: tasks_v1.Schema$TaskList;
}

export interface UpdateTaskList {
  type: TaskListActionTypes.UPDATE_TASK_LIST;
  payload: tasks_v1.Params$Resource$Tasklists$Patch;
}

export interface UpdateTaskListSuccess {
  type: TaskListActionTypes.UPDATE_TASK_LIST_SUCCESS;
  payload: tasks_v1.Schema$TaskList;
}

export interface DeleteTaskList {
  type: TaskListActionTypes.DELETE_TASK_LIST;
  payload?: string;
}

export interface DeleteTaskListSuccess {
  type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS;
}

export interface ToggleSortByDate {
  type: TaskListActionTypes.TOGGLE_SORT_BY_DATE;
  payload?: boolean;
}

export type TaskListActions =
  | GetAllTaskList
  | GetAllTaskListSuccess
  | GetTaskList
  | GetTaskListSuccess
  | NewTaskList
  | NewTaskListSuccess
  | UpdateTaskList
  | UpdateTaskListSuccess
  | DeleteTaskList
  | DeleteTaskListSuccess
  | ToggleSortByDate;

export function getAllTaskList(): GetAllTaskList {
  return {
    type: TaskListActionTypes.GET_ALL_TASK_LIST
  };
}

export function getTaskList(
  payload: TaskListAPIParams
): GetTaskList | GetAllTaskList {
  return {
    type: TaskListActionTypes.GET_TASK_LIST,
    payload
  };
}

export function newTaskList(title: string): NewTaskList {
  return {
    type: TaskListActionTypes.NEW_TASK_LIST,
    payload: {
      requestBody: {
        title
      }
    }
  };
}

export function updateTaskList(
  payload: tasks_v1.Params$Resource$Tasklists$Patch
): UpdateTaskList {
  return {
    type: TaskListActionTypes.UPDATE_TASK_LIST,
    payload
  };
}

export function delteTaskList(payload?: string): DeleteTaskList {
  return {
    type: TaskListActionTypes.DELETE_TASK_LIST,
    payload
  };
}

export function toggleSortByDate(payload?: boolean): ToggleSortByDate {
  return {
    type: TaskListActionTypes.TOGGLE_SORT_BY_DATE,
    payload
  };
}

export const TaskListActionCreators = {
  getAllTaskList,
  getTaskList,
  newTaskList,
  updateTaskList,
  delteTaskList,
  toggleSortByDate
};
