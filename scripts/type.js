const { exec } = require('child_process');

const [, , ...args] = process.argv;

const install = pkg => {
  return `yarn add ${pkg} && yarn add --dev @types/${pkg}`;
};

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

const promises = args.map(pkg => execPromise(install(pkg)));

Promise.all(promises).then(() => {
  process.exit(0);
});
