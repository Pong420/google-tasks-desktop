import path from 'path';
import { remote } from 'electron';

export { default as PATHS } from './paths.json';

export const STORAGE_DIRECTORY = path.join(
  remote.app.getPath('userData'),
  'google-tasks-desktop'
);

export const TOKEN_PATH = path.join(STORAGE_DIRECTORY, 'token.json');

export const OAUTH2_KEYS_PATH = path.join(STORAGE_DIRECTORY, 'oauth2.json');

export const LAST_VISITED_TASKS_LIST_ID = 'LAST_VISITED_TASKS_LIST_ID';
