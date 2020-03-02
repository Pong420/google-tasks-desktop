import { remote } from 'electron';

window.getCurrentWindow = remote.getCurrentWindow;
window.platform = process.platform;
