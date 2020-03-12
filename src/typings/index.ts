import { tasks_v1 } from 'googleapis';

export interface Schema$Task extends tasks_v1.Schema$Task {
  uuid: string;
  status?: 'needsAction' | 'completed';
}

export interface Schema$TaskList extends tasks_v1.Schema$TaskList {
  id: string;
}

export type Action<T1, T2> = T1 extends T2 ? T1 : never;
