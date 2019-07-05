import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Main } from './components/Main';
import { PATHS } from './constants';

const App = () => (
  <>
    <Switch>
      <Route exact path={PATHS.TASKLIST} component={Main} />
      <Redirect to={PATHS.TASKLIST} />
    </Switch>
  </>
);

export default App;
