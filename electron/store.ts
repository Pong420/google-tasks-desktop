import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

interface Schema {
  offset: {
    x?: number;
    y?: number;
  };
}

const userDataDir = app.getPath('userData');
const storageDir = path.join(userDataDir, 'google-tasks-desktop');

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir);
}

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

const adapter = new FileSync<Schema>(path.join(storageDir, 'system.json'));
const db = low(adapter);

db.defaults({
  offset: {}
}).write();

export const store = db;
