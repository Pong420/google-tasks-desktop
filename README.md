## Electron x CRA x Typescript

The `react-scripts` used in this repo is [my customized version](https://github.com/Pong420/create-react-app). The main difference are `sass-loader` config and allow to change the [webpack target](https://webpack.js.org/concepts/targets/). <br><br>
If this [CRA pull request are merged](https://github.com/facebook/create-react-app/pull/5498) and you do not require the sass prefix, you could repalce the `react-scripts` to offical version

### Reference

- [How to build an Electron app using create-react-app. No webpack configuration or “ejecting” necessary.](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)
- [electron-react-boilerplate typescript examples](https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript)

### Installation

yarn is requeired, otherwise you should replace 'yarn' in package.json

```
yarn install
```

### Development

```
yarn dev
```

### Packaging

Before packaging you may edit the build config in `package.json` which prefix with `REPLACE_`. And `React App` in `electron/menu.ts`

To package apps for the local platform:

```
yarn package
```

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies. Then,

```
yarn package-all
```

## Features

- Scss support and configured with some useful mixins. Variables and mixins in `src/scss` can be use directly without `@import`
- TSLint, ESLint with react-hooks
- Prettier
- Pre-commit checking
- Hot reload configured
- Helper scripts

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
