import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, WebPreferences, shell } from 'electron';
import { MenuBuilder } from './menu';

let mainWindow: BrowserWindow | null = null;

const isDevelopment = process.env.NODE_ENV === 'development';
const webPreferences: WebPreferences = isDevelopment
  ? {
      // if you have CROS issue, you could uncomment below config
      // webSecurity: false
    }
  : {
      // Disable Node.js Integration for Remote Content
      // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
      // nodeIntegration: false,
      // nodeIntegrationInWorker: false
    };

async function createWindow() {
  if (isDevelopment) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = await import('electron-devtools-installer');
    await installExtension(REACT_DEVELOPER_TOOLS);
    await installExtension(REDUX_DEVTOOLS);
  }

  mainWindow = new BrowserWindow({
    frame: false,
    height: 500,
    width: 300,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file:',
      slashes: true
    });

  mainWindow.loadURL(startUrl);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow && mainWindow.show();
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
}
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
