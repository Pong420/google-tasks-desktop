import path from 'path';
import { remote } from 'electron';

export { default as PATHS } from './paths.json';
export { installed as oAuth2Keys } from './oauth2.keys.json';

export const STORAGE_DIRECTORY = path.join(
  remote.app.getPath('userData'),
  'google-tasks-desktop'
);
