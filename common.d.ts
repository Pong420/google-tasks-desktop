type Theme = 'light' | 'dark';
type AccentColor = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';
type TitleBar = 'native' | 'frameless';

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

type Schema$Preferences = {
  accentColor: AccentColor;
  maxTasks: number;
  sync: SyncConfig;
  theme: Theme;
  titleBar: TitleBar;
};

declare interface Window {
  __setTheme(theme?: Theme): void;
  __setAccentColor(color?: AccentColor): void;
  __setTitleBar(titleBar?: TitleBar, shouldRelaunch?: boolean): void;
  platform: NodeJS.Platform;
  openExternal: Electron.Shell['openExternal'];
  getCurrentWindow(): Electron.BrowserWindow;
  oAuth2Storage: Schema$Storage<OAuthKeys | undefined>;
  tokenStorage: Schema$Storage<any>;
  preferencesStorage: Schema$Storage<Schema$Preferences>;
  taskListSortByDateStorage: Schema$Storage<string[]>;
  logout: () => void;
  TOKEN_PATH: string;
  OAUTH2_KEYS_PATH: string;
  PREFERENCES_PATH: string;
  TASKLIST_SORT_BY_DATE_PATH: string;
  STORAGE_DIRECTORY: string;
  relaunch: () => void;
}
