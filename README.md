## Google Tasks Desktop

<div>
  <img src="./screenshot/1.png" width="24%">
  <img src="./screenshot/2.png" width="24%">
  <img src="./screenshot/3.png" width="24%">
  <img src="./screenshot/4.png" width="24%">
</div>

### [Download](https://github.com/Pong420/google-tasks-desktop/releases)

### [Video Demo](https://pong420.github.io/google-tasks-desktop/demo.mp4)

### Project Setup

1. Enable your own [Google Task API](https://console.developers.google.com/apis/library/tasks.googleapis.com)

2. Setup your [OAuth consent screen](https://console.developers.google.com/apis/credentials/consent) in Google API Console

3. In Google API Console [Credentials](https://console.developers.google.com/apis/credentials) section.
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
- [ ] Subtask
- [ ] Error handling
- [ ] Improve / check performace

### Known issue

- The tasks that marked as completed through the official platform (Web/App) will not show in this application
- Add time / repeat is not supported as API limitation
- For tasks sort by date
  - Move task up/down shortcut is not supported currently.
  - Tasks sorting order is not synced to the official platform (Web/App)
