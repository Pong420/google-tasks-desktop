type THEME = 'light' | 'dark';
type ACCENT_COLOR = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';
type TITLE_BAR = 'native' | 'simple';

interface Schema$Storage<T> {
  get(): T;
  save(value: NonNullable<T>): void;
}

interface OAuthKeys {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

interface SyncConfig {
  enabled: boolean;
  reconnection: boolean;
  inactiveHours: number;
}

interface Schema$Preferences {
  sync: SyncConfig;
  titleBar: TITLE_BAR;
  maxTasks: number;
}

declare interface Window {
  __setTheme(theme?: THEME): void;
  __setAccentColor(color?: ACCENT_COLOR): void;
  __setTitleBar(titleBar?: TITLE_BAR, shouldRelaunch?: boolean): void;
  platform: NodeJS.Platform;
  openExternal: Electron.Shell['openExternal'];
  getCurrentWindow(): Electron.BrowserWindow;
  oAuth2Storage: Schema$Storage<OAuthKeys | undefined>;
  tokenStorage: Schema$Storage<any>;
  preferencesStorage: Schema$Storage<any>;
  taskListSortByDateStorage: Schema$Storage<string[]>;
  logout: () => void;
  TOKEN_PATH: string;
  OAUTH2_KEYS_PATH: string;
  PREFERENCES_PATH: string;
  TASKLIST_SORT_BY_DATE_PATH: string;
  STORAGE_DIRECTORY: string;
}
