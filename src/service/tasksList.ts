import { defer } from 'rxjs';
import { map } from 'rxjs/operators';
import { google, tasks_v1 } from 'googleapis';
import { oAuth2Client } from './auth';
import { Schema$TaskList } from '../typings';
import { PagePayload } from '@pong420/redux-crud';

export const { tasklists } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export function getAllTasklist(
  params?: tasks_v1.Params$Resource$Tasklists$List
) {
  return defer(() => tasklists.list(params)).pipe(
    map(
      (res): PagePayload<Schema$TaskList> => {
        const data = (res.data.items || []) as Schema$TaskList[];
        return {
          data,
          pageNo: 1,
          total: data.length
        };
      }
    )
  );
}
