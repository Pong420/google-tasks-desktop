## Electron x CRA x Typescript

The `react-scripts` used in this repo is [my customized version](https://github.com/Pong420/create-react-app). The main difference is `sass-loader` config and allow to change the [webpack target](https://webpack.js.org/concepts/targets/) by adding `ELECTRON=true` before `react-scripts xxx` in package.json.

If you will not enable `nodeIntegration`, you could use the official `react-scripts`. Or use something similar to [react-app-rewired](https://github.com/timarney/react-app-rewired)

### Reference

- [How to build an Electron app using create-react-app. No webpack configuration or “ejecting” necessary.](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)
- [electron-react-boilerplate typescript examples](https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript)

## Installation

```
git clone --depth=1 https://github.com/Pong420/electron-with-cra-ts.git

yarn install
```

## Development

```
yarn dev
```

## Packaging

Before packaging you may edit the build config in `package.json` which prefix with `REPLACE_`. And `React App` in `electron/menu.ts`

To package apps for the local platform:

```
yarn package
```

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies. Then,

```
yarn package-all
```

## Tips

### nodeIntegration

Since electron 5 `nodeIntegration` is default to false as security issue. And it is suggested to add `preload.js`. Here is a example for the approach

1. create `common.d.ts` at project root and include it in `./tsconfig.json` and `./electron/tsconfig.json`

```ts
declare interface Window {
  getConfig: any;
}
```

2. create `preload.ts` under `electron` folder

```ts
import fs from 'fs';
import { remote } from 'electron';

window.getConfig = () => {
  const configPath = path.join(remote.app.getPath('userData'), 'config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.error(error);
  }
};
```

3. Edit config in `./electron/main.ts`

```ts
import path from 'path';

new BrowserWindow({
  show: false,
  height: 600,
  width: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
});
```

4. Then adding correct definition in `./src/react-app-env.d.ts`

```ts
interface Config {
  darkTheme: boolean;
}

declare interface Window {
  getConfig(): Config;
}
```

5. Done

### Enable nodeIntegration

If you enable `nodeIntegration` then you should adding `ELECTRON=true` before `react-scripts xxx` in package.json

```json
{
  "scripts": {
    "app:dev": "cross-env ELECTRON=true BROWSER=false react-scripts start",
    "app:build": "cross-env ELECTRON=true react-scripts build"
  }
}
```

### Scss

- The variables and mixins in `src/scss` can be use directly without `@import`.

### Helper scripts

- Create a new component

```bash
// create component with index, scss, component in a folder
yarn component ComponentName

// create single component with `.tsx` only
yarn component -s ComponentName
```

- Install dependencies with type

```bash
// equivalent to `yarn add lodash` and `yarn add --dev @types/loadash`
yarn get lodash
```

- Redux

```bash
// install `redux`, `react-redux`, `rxjs` and `redux-observable`
// And create required script
yarn redux init

// Quickly create action, epic, reducer file
yarn redux name
```
