/// <reference types="react-scripts" />

declare module '*.png';
declare module '*.jpg';
declare module '*.svg' {
  export const ReactComponent: SvgrComponent;
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

// https://codesandbox.io/s/github/piotrwitek/typesafe-actions-todo-app
declare interface NodeModule {
  hot?: { accept: (path?: string, callback?: () => void) => void };
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}
declare var System: System;

declare const process: any;
declare const require: any;
