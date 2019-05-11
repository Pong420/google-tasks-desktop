import { handleOSTheme } from './theme';

process.once('loaded', () => {
  handleOSTheme();
});

window.__setAccentColor = (newColor?: ACCENT_COLOR) => {
  const color = newColor || localStorage.ACCENT_COLOR || 'blue';

  document.documentElement.setAttribute('data-accent-color', color);

  if (newColor) {
    localStorage.ACCENT_COLOR = color;
  }
};
