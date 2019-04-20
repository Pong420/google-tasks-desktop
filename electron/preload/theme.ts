import { remote } from 'electron';

export function setTheme(newTheme?: THEME) {
  try {
    let theme = newTheme || localStorage.USER_THEME || localStorage.OS_THEME;

    if (theme !== 'dark' && theme !== 'light') {
      theme = 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);

    if (newTheme) {
      localStorage.USER_THEME = theme;
    }
  } catch (err) {
    console.log(err); // tslint:disable-line
  }
}

export function handleOSTheme() {
  window.__setTheme = setTheme;

  if (process.platform === 'darwin') {
    const { systemPreferences } = remote;

    const setOSTheme = () => {
      try {
        localStorage.OS_THEME = systemPreferences.isDarkMode()
          ? 'dark'
          : 'light';

        setTheme();
      } catch (err) {}
    };

    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      setOSTheme
    );

    setOSTheme();
  }
}
