import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { google, tasks_v1 } from 'googleapis';
import { oAuth2Client } from './auth';
import { Schema$TaskList, Schema$Task } from '../typings';
import { UUID } from '../utils/uuid';

const { tasks } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export const taskUUID = new UUID();

export function getAllTasks(params: tasks_v1.Params$Resource$Tasks$List) {
  return defer(() =>
    tasks.list({ showCompleted: true, showHidden: false, ...params })
  ).pipe(
    map(res => {
      const data = (res.data.items || []) as Schema$TaskList[];
      return {
        data: data.map<Schema$Task>(d => ({ ...d, uuid: taskUUID.next() })),
        pageNo: 1,
        total: data.length
      };
    })
  );
}
