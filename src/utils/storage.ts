import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { TaskLists } from '../typings';
import { writeFileSync } from './writeFileSync';

export const directory = path.join(
  remote.app.getPath('userData'),
  'google-tasks-desktop',
  'tasks.json'
);

if (!fs.existsSync(directory)) {
  saveTaskLists([
    [
      'default',
      {
        name: 'default',
        tasks: []
      }
    ]
  ]);
}

export function saveTaskLists(storage: TaskLists) {
  writeFileSync(directory, storage);
}

export function getTaskLists() {
  return JSON.parse(fs.readFileSync(directory, 'utf-8')) as TaskLists;
}
