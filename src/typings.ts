import { tasks_v1 } from 'googleapis';

export interface Schema$Task extends tasks_v1.Schema$Task {
  uuid: string;
  sync?: string;
}

export interface Schema$TaskList extends tasks_v1.Schema$TaskList {
  sync?: string;
}

export type Schema$TaskLists = Array<[string, Schema$TaskList]>;

export interface OAuth2Keys {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}
