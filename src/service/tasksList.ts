import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { google, tasks_v1 } from 'googleapis';
import { oAuth2Client } from './auth';
import { Schema$TaskList } from '../typings';

export const { tasklists } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export function getAllTasklist(
  params?: tasks_v1.Params$Resource$Tasklists$List
) {
  return defer(() => tasklists.list(params)).pipe(
    map(res => {
      return (res.data.items || []) as Schema$TaskList[];
    })
  );
}
