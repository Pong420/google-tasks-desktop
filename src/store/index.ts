import { createHashHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { routerMiddleware } from 'connected-react-router';
import { generatePath } from 'react-router-dom';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PATHS } from '../constants';
import { lastVisit } from '../storage';
import { UUID } from '../utils/uuid';
import rootEpic from './epics';
import createRootReducer from './reducers';
import dependencies from './epicDependencies';

export const history = createHashHistory();
export const taskIds = new UUID();

history.replace(
  generatePath(PATHS.TASKLIST, {
    taskListId: lastVisit.getState() || undefined
  })
);

const epic$ = new BehaviorSubject(rootEpic);
const hotReloadingEpic: Epic<any> = (action$, state$, dependencies) =>
  epic$.pipe(switchMap(epic => epic(action$, state$, dependencies)));

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware({
    dependencies
  });
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(routerMiddleware(history), epicMiddleware)
  );

  const store = createStore(createRootReducer(history), undefined, enhancer);

  epicMiddleware.run(hotReloadingEpic);

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(createRootReducer(history));
      });

      module.hot.accept('./epics', () => {
        const nextRootEpic = require('./epics').default;
        epic$.next(nextRootEpic);
      });
    }
  }

  return store;
}

export * from './actions';
export * from './reducers';
export * from './epics';
export * from './selectors';
