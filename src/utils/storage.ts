import fs from 'fs';
import { TaskList } from '../typings';
import { writeFileSync } from './writeFileSync';
import { TASK_LISTS_PATH } from '../constants';

// if (!fs.existsSync(TASK_LISTS_PATH)) {
saveTaskLists([]);
// }

export function saveTaskLists(tasksLists: TaskList[]) {
  writeFileSync(TASK_LISTS_PATH, tasksLists);
}

export function getTaskLists() {
  return JSON.parse(fs.readFileSync(TASK_LISTS_PATH, 'utf-8')) as TaskList[];
}
