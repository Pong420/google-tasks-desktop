import { tasks_v1 } from 'googleapis';

// TODO: remove
export type TaskListName = string;
export type TaskListUUID = string;

export interface Task extends tasks_v1.Schema$Task {
  taskListId: string;
  sync: boolean;
  uuid: string;
}

export interface TaskList extends tasks_v1.Schema$TaskList {
  sync: boolean;
  uuid: string;
}

export type TaskLists = Array<[string, TaskList]>;

export interface OAuth2Keys {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}
