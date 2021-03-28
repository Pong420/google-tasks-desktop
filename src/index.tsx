import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable'; // https://github.com/supasate/connected-react-router/issues/312
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import configureStore, { history } from './store';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'typeface-roboto';
import 'typeface-nunito-sans';
import './utils/date';
import './index.scss';

const store = configureStore();

function render() {
  return ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
}

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', render);
}
