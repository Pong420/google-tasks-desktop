import { google } from 'googleapis';

const { oAuth2Storage, tokenStorage } = window;

export let OAuth2Keys = oAuth2Storage.get();
export let oAuth2Client = OAuth2Keys
  ? new google.auth.OAuth2(
      OAuth2Keys.installed.client_id,
      OAuth2Keys.installed.client_secret,
      OAuth2Keys.installed.redirect_uris[0]
    )
  : undefined;

const SCOPES = ['https://www.googleapis.com/auth/tasks'];

authenticate();

export const { tasks: tasksAPI, tasklists: taskListAPI } = google.tasks({
  version: 'v1',
  auth: oAuth2Client
});

export function authenticate() {
  if (oAuth2Client) {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    const token = tokenStorage.get();

    if (!token) {
      window.openExternal(authorizeUrl);
    } else {
      oAuth2Client.setCredentials(token);
    }
  }
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
  }

  return Promise.reject();
}
