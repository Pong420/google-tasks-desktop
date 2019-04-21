import { remote } from 'electron';

export function setTheme(newTheme?: THEME) {
  let theme = newTheme || localStorage.USER_THEME || localStorage.OS_THEME;

  if (theme !== 'dark' && theme !== 'light') {
    theme = 'light';
  }

  document.documentElement.setAttribute('data-theme', theme);

  if (newTheme) {
    localStorage.USER_THEME = theme;
  }
}

export function handleOSTheme() {
  window.__setTheme = setTheme;

  if (process.platform === 'darwin') {
    const { systemPreferences } = remote;

    const setOSTheme = () => {
      localStorage.OS_THEME = systemPreferences.isDarkMode() ? 'dark' : 'light';
    };

    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      () => {
        setOSTheme();
        setTheme();
      }
    );

    setOSTheme();
  }
}
