import { handleOSTheme } from './theme';

process.once('loaded', () => {
  handleOSTheme();
});
