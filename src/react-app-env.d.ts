/// <reference types="react-scripts" />

declare module '*.scss';
declare module 'react-desktop/windows';

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare namespace NodeJS {
  interface Module {
    hot?: { accept: (path?: string, callback?: () => void) => void };
  }
}

declare const process: any;
declare const require: any;
