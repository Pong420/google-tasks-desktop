import fs from 'fs';
import { remote } from 'electron';
import { google } from 'googleapis';
import { TOKEN_PATH, OAuth2Keys } from './constants';
import { writeFileSync } from './utils/writeFileSync';

const SCOPES = ['https://www.googleapis.com/auth/tasks'];
const oAuth2Client = new google.auth.OAuth2(
  OAuth2Keys.client_id,
  OAuth2Keys.client_secret,
  OAuth2Keys.redirect_uris[0]
);

export const { tasks: tasksAPI, tasklists: taskListAPI } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export async function authenticateAPI() {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' ')
    });

    fs.readFile(TOKEN_PATH, 'utf-8', (err, token) => {
      if (err) {
        remote.shell.openExternal(authorizeUrl);
        reject();
      } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve();
      }
    });
  });
}

export async function getTokenAPI(code: string) {
  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        reject(err);
      } else {
        try {
          oAuth2Client.setCredentials(token!);
          writeFileSync(TOKEN_PATH, token!);
          resolve(token!);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}
