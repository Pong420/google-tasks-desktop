import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { PrivateRoute } from './components/PrivateRoute';
import { Auth } from './pages/Auth';
import { TaskList } from './pages/TaskList';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <>
      <Switch>
        <Route exact path={PATHS.AUTH} component={Auth} />
        <PrivateRoute exact path={PATHS.TASKLIST} component={TaskList} />
      </Switch>
    </>
  </>
);

export default App;
