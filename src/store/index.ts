import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import rootEpic from './epics';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(routerMiddleware(history), epicMiddleware)
  );

  const store = createStore(createRootReducer(history), undefined, enhancer);

  epicMiddleware.run(rootEpic);

  return store;
}

export * from './actions';
export * from './reducers';
export * from './epics';
