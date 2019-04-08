import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { google } from 'googleapis';
import { STORAGE_DIRECTORY, oAuth2Keys } from './constants';
import { writeFileSync } from './utils/writeFileSync';

const TOKEN_PATH = path.join(STORAGE_DIRECTORY, 'token.json');
const SCOPES = ['https://www.googleapis.com/auth/tasks'];

const oAuth2Client = new google.auth.OAuth2(
  oAuth2Keys.client_id,
  oAuth2Keys.client_secret,
  oAuth2Keys.redirect_uris[0]
);

export const taskApi = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export async function authenticateAPI() {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' ')
    });

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        remote.shell.openExternal(authorizeUrl);
        reject();
      } else {
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
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
