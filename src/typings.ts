import { tasks_v1 } from 'googleapis';

export interface Task extends tasks_v1.Schema$Task {
  taskListId: string;
  sync: boolean;
  tid: string;
}

export interface TaskList extends tasks_v1.Schema$TaskList {
  sync: boolean;
  tid: string;
}

export interface OAuth2Keys {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}
