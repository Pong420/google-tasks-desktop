import { remote } from 'electron';
import { google, tasks_v1 } from 'googleapis';

const { oAuth2Storage, tokenStorage } = window;

export let OAuth2Keys = oAuth2Storage.get();
export let oAuth2Client =
  OAuth2Keys && OAuth2Keys.installed
    ? new google.auth.OAuth2(
        OAuth2Keys.installed.client_id,
        OAuth2Keys.installed.client_secret,
        OAuth2Keys.installed.redirect_uris[0]
      )
    : undefined;

const SCOPES = ['https://www.googleapis.com/auth/tasks'];

export let tasksAPI: tasks_v1.Resource$Tasks;
export let taskListAPI: tasks_v1.Resource$Tasklists;

if (oAuth2Client) {
  const api = google.tasks({ version: 'v1', auth: oAuth2Client });
  tasksAPI = api.tasks;
  taskListAPI = api.tasklists;
}

export async function authenticate() {
  if (oAuth2Client) {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    const token = tokenStorage.get();

    if (token) {
      remote.shell.openExternal(authorizeUrl);
      return Promise.reject();
    } else {
      oAuth2Client.setCredentials(token);
      return Promise.resolve();
    }
  }

  return Promise.reject();
}

export async function getToken(code: string) {
  if (oAuth2Client) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      tokenStorage.save(tokens);
      return tokens;
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject();
  }
}
