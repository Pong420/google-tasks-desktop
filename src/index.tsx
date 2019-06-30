import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConnectedRouter, replace, RouterAction } from 'connected-react-router';
import { generatePath } from 'react-router-dom';
import { theme } from './theme';
import { PATHS, LAST_VISITED_TASKS_LIST_ID } from './constants';
import configureStore, { history } from './store';
import App from './App';
import 'typeface-roboto';
import 'typeface-nunito-sans';
import './utils/date';
import './index.scss';

const store = configureStore();

const render = (Component: React.ComponentType<{}>) => {
  store.dispatch<RouterAction>(
    replace(
      generatePath(PATHS.TASKLIST, {
        taskListId:
          localStorage.getItem(LAST_VISITED_TASKS_LIST_ID) || undefined
      })
    )
  );

  return ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>,
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
