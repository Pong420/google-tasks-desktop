import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  typography: {
    fontSize: 14,
    fontFamily: 'Roboto',
    useNextVariants: true
  },
  palette: {
    type: 'light',
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#4285f4'
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
      disabled: '#b8b8b8'
    }
  },
  props: {
    MuiDivider: {
      light: true,
      style: { margin: '0.4em 0' }
    },
    MuiSvgIcon: {
      fontSize: 'small',
      color: 'inherit'
    }
  }
});

export default theme;
