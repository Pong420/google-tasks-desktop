import fs from 'fs';
import path from 'path';
import { App, SystemPreferences } from 'electron';

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

export function initStorage(app: App, systemPreferences: SystemPreferences) {
  const STORAGE_DIRECTORY = path.join(
    app.getPath('userData'),
    'google-tasks-desktop'
  );

  const TOKEN_PATH = path.join(STORAGE_DIRECTORY, 'token.json');

  const OAUTH2_KEYS_PATH = path.join(STORAGE_DIRECTORY, 'oauth2.json');

  const PREFERENCES_PATH = path.join(STORAGE_DIRECTORY, 'preferences.json');

  const TASKLIST_SORT_BY_DATE_PATH = path.join(
    STORAGE_DIRECTORY,
    'tasklist-order.json'
  );

  if (!fs.existsSync(STORAGE_DIRECTORY)) {
    fs.mkdirSync(STORAGE_DIRECTORY);
  }

  const oAuth2Storage = FileStorage<any>(OAUTH2_KEYS_PATH);

  const tokenStorage = FileStorage<any>(TOKEN_PATH);

  const taskListSortByDateStorage = FileStorage<any>(
    TASKLIST_SORT_BY_DATE_PATH,
    []
  );

  const defaultPrefrences: Schema$Preferences = {
    accentColor: 'blue',
    maxTasks: 100,
    theme: systemPreferences.isDarkMode() ? 'dark' : 'light',
    titleBar: 'native',
    sync: {
      enabled: true,
      reconnection: true,
      inactiveHours: 12
    }
  };

  const preferencesStorage = FileStorage<Schema$Preferences>(
    PREFERENCES_PATH,
    defaultPrefrences
  );

  // for version <= v3.0.2
  let preferences = preferencesStorage.get();
  preferencesStorage.save(
    Object.entries(defaultPrefrences).reduce((results, [key, value]) => {
      const currentValue: unknown =
        preferences[key as keyof typeof preferences];
      return {
        ...results,
        [key]: typeof currentValue === 'undefined' ? value : currentValue
      };
    }, {} as Schema$Preferences)
  );

  return {
    STORAGE_DIRECTORY,
    TOKEN_PATH,
    PREFERENCES_PATH,
    TASKLIST_SORT_BY_DATE_PATH,
    oAuth2Storage,
    tokenStorage,
    taskListSortByDateStorage,
    preferencesStorage
  };
}
