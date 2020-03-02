const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const [, , ...args] = process.argv;

const execPromise = command => {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });

    cmd.stdout.on('data', data => {
      console.log(data.trim());
    });
  });
};

const root = path.join(__dirname, '../src');
const templatePath = path.join(__dirname, 'template');
const store = path.join(root, 'store');
const subdir = ['actions', 'epics', 'reducers'].map(dir =>
  path.join(store, dir)
);

if (args[0] === 'init') {
  const commands = [
    `yarn add redux`,
    `yarn add react-redux && yarn add --dev @types/react-redux`,
    `yarn add rxjs && yarn add redux-observable`
  ];

  (async () => {
    for (const cmd of commands) {
      await execPromise(cmd);
    }
  })();

  [store, ...subdir].forEach(dir => {
    const key = dir.split('/').slice(-1)[0];
    fs.readFile(
      path.join(templatePath, 'store', `${key}.tmpl`),
      (error, content) => {
        if (!error) {
          !fs.existsSync(dir) && fs.mkdirSync(dir);
          fs.writeFileSync(path.join(dir, 'index.ts'), content);
        }
      }
    );
  });

  fs.readFile(path.join(templatePath, 'useActions.tmpl'), (error, content) => {
    if (!error) {
      fs.writeFileSync(path.join(root, 'hooks', 'useActions.ts'), content);
    }
  });
} else if (args[0]) {
  const filename = args[0];
  subdir.map(dir => fs.writeFileSync(path.join(dir, `${filename}.ts`), ''));
}
