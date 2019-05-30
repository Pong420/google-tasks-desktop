import { tasks_v1 } from 'googleapis';
import { SortEnd } from 'react-sortable-hoc';
import { Schema$Task } from '../../typings';
import uuid from 'uuid';

export enum TaskActionTypes {
  GET_ALL_TASKS = 'GET_ALL_TASKS',
  GET_ALL_TASKS_SUCCESS = 'GET_ALL_TASKS_SUCCESS',
  GET_ALL_TASKS_SILENT = 'GET_ALL_TASKS_SILENT',
  GET_ALL_TASKS_SILENT_SUCCESS = 'GET_ALL_TASKS_SILENT_SUCCESS',
  NEW_TASK = 'NEW_TASK',
  NEW_TASK_SUCCESS = 'NEW_TASK_SUCCESS',
  UPDATE_TASK = 'UPDATE_TASK',
  UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
  DELETE_TASK = 'DELETE_TASK',
  DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
  DELETE_COMPLETED_TASKS = 'DELETE_COMPLETED_TASKS',
  DELETE_COMPLETED_TASKS_SUCCESS = 'DELETE_COMPLETED_TASKS_SUCCESS',
  MOVE_TASKS = 'MOVE_TASKS',
  MOVE_TASKS_SUCCESS = 'MOVE_TASKS_SUCCESS',
  SET_FOCUS_INDEX = 'SET_FOCUS_INDEX'
}

export interface Payload$NewTask extends Pick<tasks_v1.Schema$Task, 'due'> {
  previousTask?: Schema$Task;
}

export interface Payload$DeleteTask extends Schema$Task {
  previousTaskIndex?: number;
}

export type Payload$SortTasks = 'order' | 'date';

export interface GetAllTasks {
  type: TaskActionTypes.GET_ALL_TASKS;
}

export interface GetAllTasksSuccess {
  type: TaskActionTypes.GET_ALL_TASKS_SUCCESS;
  payload: tasks_v1.Schema$Task[];
}

export interface GetAllTasksSilent {
  type: TaskActionTypes.GET_ALL_TASKS_SILENT;
}

export interface GetAllTasksSilentSuccess {
  type: TaskActionTypes.GET_ALL_TASKS_SILENT_SUCCESS;
  payload: tasks_v1.Schema$Task[];
}

export interface NewTask {
  type: TaskActionTypes.NEW_TASK;
  payload: Payload$NewTask & {
    uuid: string;
  };
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
  payload: Schema$Task;
}

export interface DeleteTask {
  type: TaskActionTypes.DELETE_TASK;
  payload: Payload$DeleteTask;
}

export interface DeleteTaskSuccess {
  type: TaskActionTypes.DELETE_TASK_SUCCESS;
}

export interface DeleteCompletedTasks {
  type: TaskActionTypes.DELETE_COMPLETED_TASKS;
}

export interface DeleteCompletedTasksSuccess {
  type: TaskActionTypes.DELETE_COMPLETED_TASKS_SUCCESS;
}

export interface MoveTask {
  type: TaskActionTypes.MOVE_TASKS;
  payload: Pick<SortEnd, 'newIndex' | 'oldIndex'>;
}

export interface MoveTaskSuccess {
  type: TaskActionTypes.MOVE_TASKS_SUCCESS;
}

export interface SetFocusIndex {
  type: TaskActionTypes.SET_FOCUS_INDEX;
  payload: string | number | null;
}

export type TaskActions =
  | GetAllTasks
  | GetAllTasksSuccess
  | GetAllTasksSilent
  | GetAllTasksSilentSuccess
  | NewTask
  | NewTaskSuccess
  | UpdateTask
  | UpdateTaskSuccess
  | DeleteTask
  | DeleteTaskSuccess
  | DeleteCompletedTasks
  | DeleteCompletedTasksSuccess
  | MoveTask
  | MoveTaskSuccess
  | SetFocusIndex;

export const TaskActionCreators = {
  getAllTasks(): GetAllTasks {
    return {
      type: TaskActionTypes.GET_ALL_TASKS
    };
  },
  newTask(payload?: Payload$NewTask): NewTask {
    return {
      type: TaskActionTypes.NEW_TASK,
      payload: {
        ...payload,
        uuid: uuid.v4()
      }
    };
  },
  deleteTask(payload: Payload$DeleteTask): DeleteTask {
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
  deleteCompletedTasks(): DeleteCompletedTasks {
    return {
      type: TaskActionTypes.DELETE_COMPLETED_TASKS
    };
  },
  moveTask(payload: Pick<SortEnd, 'newIndex' | 'oldIndex'>): MoveTask {
    return {
      type: TaskActionTypes.MOVE_TASKS,
      payload
    };
  },
  setFocusIndex(payload: string | number | null): SetFocusIndex {
    return {
      type: TaskActionTypes.SET_FOCUS_INDEX,
      payload
    };
  }
};
