import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import 'typeface-open-sans';

import './index.scss';

const theme = createMuiTheme({
  typography: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    useNextVariants: true
  },
  palette: {
    type: 'light',
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#4285f4'
    }
  },
  props: {
    MuiMenu: {
      disableAutoFocusItem: true,
      PaperProps: {
        style: {
          borderRadius: '8px',
          boxShadow: `0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)`
        }
      }
    },
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
      fontSize: 'small'
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept();
}
