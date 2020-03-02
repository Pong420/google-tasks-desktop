type THEME = 'light' | 'dark';
type ACCENT_COLOR = 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'grey';

declare interface Window {
  __setTheme(theme?: THEME): void;
  __setAccentColor(color?: ACCENT_COLOR): void;
}
