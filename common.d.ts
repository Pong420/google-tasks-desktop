declare interface Window {
  getCurrentWindow: Electron.Remote['getCurrentWindow'];
  platform: NodeJS.Platform;
}
