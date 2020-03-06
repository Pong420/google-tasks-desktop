import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto'
  },
  props: {
    MuiDivider: {
      light: true,
      style: {
        margin: '0.4em 0',
        backgroundColor: 'var(--border-color)'
      }
    },
    MuiSvgIcon: {
      fontSize: 'small',
      color: 'inherit'
    },
    MuiButton: {
      color: 'inherit'
    }
  }
});

export default theme;
