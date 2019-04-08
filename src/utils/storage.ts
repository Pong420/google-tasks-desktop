import fs from 'fs';
import path from 'path';
import { TaskLists } from '../typings';
import { writeFileSync } from './writeFileSync';
import { STORAGE_DIRECTORY } from '../constants';

export const TASKLISTS_PATH = path.join(STORAGE_DIRECTORY, 'tasks.json');

if (!fs.existsSync(TASKLISTS_PATH)) {
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

export function saveTaskLists(tasksLists: TaskLists) {
  writeFileSync(TASKLISTS_PATH, tasksLists);
}

export function getTaskLists() {
  return JSON.parse(fs.readFileSync(TASKLISTS_PATH, 'utf-8')) as TaskLists;
}
