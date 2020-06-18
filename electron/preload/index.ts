import fs from 'fs';
import { remote } from 'electron';
import { handleOSTheme } from './theme';
import './storage';

window.__setAccentColor = (newColor?: ACCENT_COLOR) => {
  const color = newColor || localStorage.ACCENT_COLOR || 'blue';

  document.documentElement.setAttribute('data-accent-color', color);

  if (newColor) {
    localStorage.ACCENT_COLOR = color;
  }
};

window.platform = process.platform;
window.getCurrentWindow = remote.getCurrentWindow;
window.openExternal = remote.shell.openExternal;
window.logout = () => fs.unlinkSync(window.TOKEN_PATH);

process.once('loaded', () => {
  handleOSTheme();
});
