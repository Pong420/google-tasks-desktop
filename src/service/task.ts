import { Observable, defer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { google, tasks_v1 } from 'googleapis';
import { PagePayload } from '@pong420/redux-crud';
import { oAuth2Client } from './auth';
import { Schema$Task } from '../typings';
import { UUID } from '../utils/uuid';

const { tasks } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export const taskUUID = new UUID();

// https://developers.google.com/tasks/performance#partial
const fields: Record<keyof Omit<Schema$Task, 'uuid'>, unknown> = {
  completed: '',
  hidden: '',
  id: '',
  notes: '',
  position: '',
  status: '',
  title: '',
  due: ''
};

export function getAllTasks(
  params: tasks_v1.Params$Resource$Tasks$List,
  prevTasks: Schema$Task[] = []
): Observable<PagePayload<Schema$Task>> {
  const max = Number(params.maxResults || 100);
  const maxResults = String(Math.min(max, 100));

  return defer(() =>
    tasks.list({
      ...params,
      showCompleted: true,
      showHidden: true,
      maxResults,
      fields: `nextPageToken,items(${Object.keys(fields).join(',')})`
    })
  ).pipe(
    mergeMap(response => {
      const { nextPageToken, items = [] } = response.data;
      const data = prevTasks.concat(
        items
          .sort((a, b) => Number(a.position) - Number(b.position))
          .map<Schema$Task>(d => ({ ...d, uuid: taskUUID.next() }))
      );

      if (nextPageToken && data.length < max) {
        return getAllTasks({ ...params, pageToken: nextPageToken }, data);
      }

      return of({
        data,
        pageNo: 1,
        total: data.length
      });
    })
  );
}
