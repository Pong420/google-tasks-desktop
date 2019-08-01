import { createLocalStorage } from './storage';

export const lastVisit = createLocalStorage<string>(
  'LAST_VISITED_TASKS_LIST_ID',
  {
    defaultValue: '',
    serialize: data => data,
    deserialize: data => data
  }
);
