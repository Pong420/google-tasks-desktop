import path from 'path';
import { remote } from 'electron';

export { default as PATHS } from './paths.json';
export { installed as OAuth2Keys } from './oauth2.keys.json';

export const STORAGE_DIRECTORY = path.join(
  remote.app.getPath('userData'),
  'google-tasks-desktop'
);

export const TASK_LISTS_PATH = path.join(STORAGE_DIRECTORY, 'tasks.json');

export const OAUTH2_KEYS_PATH = path.join(STORAGE_DIRECTORY, 'oAuth2Keys.json');

export const TOKEN_PATH = path.join(STORAGE_DIRECTORY, 'token.json');
