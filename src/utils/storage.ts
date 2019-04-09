import fs from 'fs';
import { TaskLists } from '../typings';
import { writeFileSync } from './writeFileSync';
import { TASK_LISTS_PATH } from '../constants';

if (!fs.existsSync(TASK_LISTS_PATH)) {
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
  writeFileSync(TASK_LISTS_PATH, tasksLists);
}

export function getTaskLists() {
  return JSON.parse(fs.readFileSync(TASK_LISTS_PATH, 'utf-8')) as TaskLists;
}
