// @ts-check
const exec = require('child_process').exec;
const net = require('net');

let client = new net.Socket();
const port = process.env.PORT ? Number(process.env.PORT) - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

let startedElectron = false;
const tryConnection = () =>
  client.connect({ port }, () => {
    client.end();
    if (!startedElectron) {
      process.off('uncaughtException', uncaughtException);
      client.destroy();
      console.log('starting electron');
      startedElectron = true;
      exec('npm run electron:dev');
    }
  });

exec('npm run electron:compile', tryConnection);

function uncaughtException() {
  client.destroy();
  client = new net.Socket();
  setTimeout(tryConnection, 1000);
}

process.on('uncaughtException', uncaughtException);
