/// <reference types="pong-react-scripts" />

declare module '*.scss';

declare module 'react-desktop/macOs';

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare namespace NodeJS {
  interface Module {
    hot?: { accept: (path?: string, callback?: () => void) => void };
  }
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}
declare var System: System;

declare const process: any;
declare const require: any;
