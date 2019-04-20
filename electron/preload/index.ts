import { handleOSTheme, setTheme } from './theme';

process.once('loaded', () => {
  handleOSTheme();
});

window.addEventListener(
  'DOMContentLoaded',
  () => {
    setTheme();
    handlePlatformAttribute();
  },
  {
    once: true
  }
);

function handlePlatformAttribute() {
  document.documentElement.setAttribute('data-platform', process.platform);
}
