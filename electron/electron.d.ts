declare module 'electron-store';
declare module 'electron-devtools-installer';

type THEME = 'light' | 'dark';

declare interface Window {
  __setTheme(theme?: THEME): void;
}
