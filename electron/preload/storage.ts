import fs from 'fs';
import path from 'path';
import { remote } from 'electron';

const STORAGE_DIRECTORY = path.join(
  remote.app.getPath('userData'),
  'google-tasks-desktop'
);

export const TOKEN_PATH = (window.TOKEN_PATH = path.join(
  STORAGE_DIRECTORY,
  'token.json'
));

export const OAUTH2_KEYS_PATH = (window.OAUTH2_KEYS_PATH = path.join(
  STORAGE_DIRECTORY,
  'oauth2.json'
));

export const PREFERENCES_PATH = (window.PREFERENCES_PATH = path.join(
  STORAGE_DIRECTORY,
  'preferences.json'
));

export const TASKLIST_SORT_BY_DATE_PATH = (window.TASKLIST_SORT_BY_DATE_PATH = path.join(
  STORAGE_DIRECTORY,
  'tasklist-order.json'
));

if (!fs.existsSync(STORAGE_DIRECTORY)) {
  fs.mkdirSync(STORAGE_DIRECTORY);
}

function FileStorage<T extends {}>(path: string): Schema$Storage<T | undefined>;
function FileStorage<T extends {}>(path: string, defaultValue: T): Schema$Storage<T> // prettier-ignore
// prettier-ignore
function FileStorage<T extends {}>(path: string, defaultValue?: T): Schema$Storage<T | undefined> { 
  return {
    get() {
      try {
        const val = fs.readFileSync(path, 'utf8');
        return JSON.parse(val);
      } catch (error) {}

      return defaultValue;
    },
    save(value) {
      fs.writeFileSync(path, JSON.stringify(value, null, 2));
    }
  };
}

window.STORAGE_DIRECTORY = STORAGE_DIRECTORY;

window.oAuth2Storage = FileStorage(OAUTH2_KEYS_PATH);

window.tokenStorage = FileStorage(TOKEN_PATH);

window.taskListSortByDateStorage = FileStorage(TASKLIST_SORT_BY_DATE_PATH, []);

window.preferencesStorage = FileStorage(PREFERENCES_PATH, {
  enabled: true,
  reconnection: true,
  inactiveHours: 12
});
