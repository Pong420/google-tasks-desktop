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
    MuiDialog: {
      PaperProps: {
        style: {
          borderRadius: '8px',
          boxShadow: `0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)`
        }
      }
    },
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
