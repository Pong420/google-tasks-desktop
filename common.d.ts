type THEME = 'light' | 'dark';
type ACCENT_COLOR = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';

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

declare interface Window {
  __setTheme(theme?: THEME): void;
  __setAccentColor(color?: ACCENT_COLOR): void;
  platform: NodeJS.Platform;
  openExternal: Electron.Shell['openExternal'];
  getCurrentWindow(): Electron.BrowserWindow;
  oAuth2Storage: Schema$Storage<OAuthKeys | undefined>;
  tokenStorage: Schema$Storage<any>;
  TOKEN_PATH: string;
  OAUTH2_KEYS_PATH: string;
}
