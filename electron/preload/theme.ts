import { remote } from 'electron';

export const setTheme = (newTheme?: THEME) => {
  const preferences = window.preferencesStorage.get();
  let theme = newTheme || preferences.theme;

  document.documentElement.setAttribute('data-theme', theme);

  if (newTheme) {
    window.preferencesStorage.save({
      ...preferences,
      theme
    });
  }
};

window.__setTheme = setTheme;

export function handleOSTheme() {
  if (process.platform === 'darwin') {
    const { systemPreferences } = remote;
    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      () => setTheme()
    );
  }
}
