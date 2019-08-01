import { app } from 'electron';
import path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

interface Schema {
  offset: {
    x?: number;
    y?: number;
  };
}

const adapter = new FileSync<Schema>(
  path.join(app.getPath('userData'), 'google-tasks-desktop', 'system.json')
);
const db = low(adapter);

db.defaults({
  offset: {}
}).write();

export const store = db;
