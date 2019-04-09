export type TaskListName = string;

export interface Task {
  id: string;
  taskListName: TaskListName;
  title: string;
  description?: string;
  dateTime?: number;
  subTask?: string[];
  completed?: boolean;
}

export interface TaskList {
  name: TaskListName;
  tasks: Task[];
  sortBy?: 'order' | 'date';
}

export type TaskLists = Array<[TaskListName, TaskList]>;

export interface OAuth2Keys {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}
