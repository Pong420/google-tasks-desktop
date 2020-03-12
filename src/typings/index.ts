import { tasks_v1 } from 'googleapis';

export interface Schema$Task extends tasks_v1.Schema$Task {
  uuid: string;
  status?: 'needsAction' | 'completed' | string | null;
}

export interface Schema$TaskList extends tasks_v1.Schema$TaskList {
  id: string;
}

export type ExtractAction<
  T1 extends { type: string },
  T2 extends T1['type']
> = T1 extends { type: T2 } ? T1 : never;
