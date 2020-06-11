## Google Tasks Desktop

> Unofficial google tasks desktop application. Using React and google tasks api

:warning: This is the v3 branch, which is working in progress.

<div>
  <img src="./screenshot/1.png" width="24%">
  <img src="./screenshot/2.png" width="24%">
  <img src="./screenshot/3.png" width="24%">
  <img src="./screenshot/4.png" width="24%">
</div>

#### [Download](https://github.com/Pong420/google-tasks-desktop/releases)

#### :warning: You will need to enable your own [Google Tasks API](https://console.developers.google.com/apis/library/tasks.googleapis.com) whether you are user or developer.

#### Step to enable Google Tasks API.

1. Setup your [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent) in Google API Console

2. In Google API Console [Credentials](https://console.developers.google.com/apis/credentials) section.
   Create credentials => OAuth client ID => Other => Create. After, you should get a json file like this.

```json
{
  "installed": {
    "client_id": "...",
    "project_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "...",
    "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
  }
}
```

3. Start and drag this file into the application.

4. Click on `Get Code` button then you will require authentication. Just ignore the `This app isn't verified` warning and continue because you are the app owner.

5. Paste the code into the input filed and click confirm. Done!

### Development

```
yarn dev
```

### Packaging

To package apps for the local platform:

```
yarn package
```

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies. Then,

```
yarn package-all
```

### TODO

- [x] Support Window & Linux
- [x] Keyboard shortcuts
- [x] Dark Theme
- [x] Add Note
- [x] Add Date
- [x] Animation
- [x] Sync data periodically
- [x] Move task to another list
- [x] Improve / check performace
- [ ] Subtask
- [ ] Error handling

### Known issue

- Add time / repeat is not supported as API limitation
- Tasks sorting type (My order / Date) is not synced to the official platform (Web/App)
- The tasks that marked as completed through the official platform (Web/App) will not show in this application
- The position of the task which marks as complete to incomplete may be different after refresh
