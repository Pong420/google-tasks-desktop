import fs from 'fs';
import { remote } from 'electron';
import { google } from 'googleapis';
import { TOKEN_PATH, OAUTH2_KEYS_PATH } from './constants';
import { writeFileSync } from './utils/writeFileSync';
import { OAuthKeys } from './typings';

export let OAuth2Keys: OAuthKeys | null = null;
export let oAuth2Client = new google.auth.OAuth2();

try {
  OAuth2Keys = JSON.parse(
    fs.readFileSync(OAUTH2_KEYS_PATH, 'utf-8')
  ) as OAuthKeys;

  oAuth2Client = new google.auth.OAuth2(
    OAuth2Keys.installed.client_id,
    OAuth2Keys.installed.client_secret,
    OAuth2Keys.installed.redirect_uris[0]
  );
} catch {}

const SCOPES = ['https://www.googleapis.com/auth/tasks'];

export const { tasks: tasksAPI, tasklists: taskListAPI } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export function authenticateAPI() {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
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

export function getTokenAPI(code: string) {
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
