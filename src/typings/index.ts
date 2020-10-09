import { tasks_v1 } from 'googleapis';

export interface Schema$Task {
  uuid: string;

  completed?: string | null;

  hidden?: boolean | null;

  id?: string | null;

  notes?: string | null;

  position?: string | null;

  status?: string | null;

  title?: string | null;

  due?: string | null;
}

export interface Schema$TaskList extends tasks_v1.Schema$TaskList {
  id: string;
}

export type ExtractAction<
  T1 extends { type: string },
  T2 extends T1['type']
> = T1 extends { type: T2 } ? T1 : never;
