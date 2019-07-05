import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { Main } from './components/Main';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <Switch>
      <Route exact path={PATHS.TASKLIST} component={Main} />
      <Redirect to={PATHS.TASKLIST} />
    </Switch>
  </>
);

export default App;
