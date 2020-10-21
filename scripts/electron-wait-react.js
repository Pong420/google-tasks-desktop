// @ts-check
const exec = require('child_process').exec;
const net = require('net');

const client = new net.Socket();
const port = process.env.PORT ? Number(process.env.PORT) - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const tryConnection = () =>
  client.connect({ port: port }, () => {
    client.end();
    process.exit(0);
  });

exec('npm run electron:compile', tryConnection);

client.on('error', error => {
  setTimeout(tryConnection, 1000);
});
