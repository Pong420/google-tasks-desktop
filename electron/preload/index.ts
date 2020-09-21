import fs from 'fs';
import { remote } from 'electron';
import { handleOSTheme } from './theme';
import { initStorage } from '../storage';

function relaunch() {
  remote.app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  remote.app.exit(0);
}

window.__setAccentColor = (newColor?: ACCENT_COLOR) => {
  const color = newColor || localStorage.ACCENT_COLOR || 'blue';

  document.documentElement.setAttribute('data-accent-color', color);

  if (newColor) {
    localStorage.ACCENT_COLOR = color;
  }
};

window.__setTitleBar = (newTitleBar?: TITLE_BAR, shouldRelaunch?: boolean) => {
  const preferences = window.preferencesStorage.get();
  const titleBar = newTitleBar || preferences.titleBar;
  document.documentElement.setAttribute('data-title-bar', titleBar);
  if (titleBar) {
    window.preferencesStorage.save({
      ...preferences,
      titleBar
    });

    if (shouldRelaunch) {
      relaunch();
    }
  }
};

const storage = initStorage(remote.app);

Object.assign(window, storage);

window.platform = process.platform;
window.getCurrentWindow = remote.getCurrentWindow;
window.openExternal = remote.shell.openExternal;
window.logout = () => fs.unlinkSync(storage.TOKEN_PATH);

process.once('loaded', () => {
  handleOSTheme();
});
