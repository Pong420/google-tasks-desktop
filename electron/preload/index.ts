import { handleOSTheme } from './theme';

process.once('loaded', () => {
  handleOSTheme();
});

window.__setAccentColor = (newColor: ACCENT_COLOR = 'blue') => {
  const color = newColor || localStorage.ACCENT_COLOR;

  document.documentElement.setAttribute('data-accent-color', color);

  if (newColor) {
    localStorage.ACCENT_COLOR = color;
  }
};
