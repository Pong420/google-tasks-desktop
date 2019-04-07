## Google Tasks Desktop (WIP)

google task desktop client, working in prorgress

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

Before packaging you may edit the build config in `package.json` which prefix with `REPLACE_`.

To package apps for the local platform:

```
yarn package
```

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies. Then,

```
yarn package-all
```
