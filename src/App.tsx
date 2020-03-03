import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { PrivateRoute } from './components/PrivateRoute';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <>
      <Switch>
        <Route exact path={PATHS.AUTH} component={Auth} />
        <PrivateRoute exact path={PATHS.HOME} component={Home} />
      </Switch>
    </>
  </>
);

export default App;
