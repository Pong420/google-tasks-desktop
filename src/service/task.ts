import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { google, tasks_v1 } from 'googleapis';
import { oAuth2Client } from './auth';
import { Schema$Task } from '../typings';
import { UUID } from '../utils/uuid';

const { tasks } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export const taskUUID = new UUID();

// TODO: https://developers.google.com/tasks/performance#partial
export function getAllTasks(params: tasks_v1.Params$Resource$Tasks$List) {
  return defer(() =>
    tasks.list({ showCompleted: true, showHidden: true, ...params })
  ).pipe(
    map(res => {
      const data = (res.data.items || []) as Schema$Task[];
      return {
        data: data
          .sort((a, b) => Number(a.position) - Number(b.position))
          .map<Schema$Task>(d => ({ ...d, uuid: taskUUID.next() })),
        pageNo: 1,
        total: data.length
      };
    })
  );
}
