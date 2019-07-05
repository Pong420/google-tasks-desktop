import { Ref } from 'react';
import { tasks_v1 } from 'googleapis';

export interface OAuthKeys {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

export interface Schema$Task extends tasks_v1.Schema$Task {
  uuid: string;
}

// tslint:disable-next-line
export interface Schema$TaskList extends tasks_v1.Schema$TaskList {}

export interface OAuth2Keys {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}

export interface SyncPreferences {
  enabled: boolean;
  reconnection: boolean;
  inactiveHours: number;
}

export interface SimplebarAPI {
  getScrollElement(): HTMLElement | null;
}

export interface WithSimplebar {
  simplebarRef?: Ref<SimplebarAPI>;
}
