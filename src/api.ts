import { remote } from 'electron';
import { google } from 'googleapis';
import { oAuth2Storage, tokenStorage } from './storage';
import { OAuthKeys } from './typings';

export let OAuth2Keys: Partial<OAuthKeys> = oAuth2Storage.getState();
export let oAuth2Client = OAuth2Keys.installed
  ? new google.auth.OAuth2(
      OAuth2Keys.installed.client_id,
      OAuth2Keys.installed.client_secret,
      OAuth2Keys.installed.redirect_uris[0]
    )
  : undefined;

const SCOPES = ['https://www.googleapis.com/auth/tasks'];

export const { tasks: tasksAPI, tasklists: taskListAPI } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export async function authenticateAPI() {
  if (oAuth2Client) {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    if (tokenStorage.isEmpty().value()) {
      remote.shell.openExternal(authorizeUrl);
      return Promise.reject();
    } else {
      const token = tokenStorage.getState();
      oAuth2Client.setCredentials(token);
      return Promise.resolve();
    }
  }

  return Promise.reject();
}

export async function getTokenAPI(code: string) {
  if (oAuth2Client) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      tokenStorage.setState(tokens).write();
      return tokens;
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject();
  }
}
