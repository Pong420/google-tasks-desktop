import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Auth } from './components/Auth';
import configureStore, { history } from './store';
import App from './App';
import './index.scss';

const store = configureStore();

const render = (Component: React.ComponentType<{}>) => {
  return ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Auth>
          <Component />
        </Auth>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
