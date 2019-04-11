import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import './index.scss';

const theme = createMuiTheme({
  typography: {
    fontSize: 14,
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
      disableAutoFocusItem: true
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
