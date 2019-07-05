import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { TaskList } from './components/TaskList';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <Switch>
      <Route exact path={PATHS.TASKLIST} component={TaskList} />
      <Redirect to={PATHS.TASKLIST} />
    </Switch>
  </>
);

export default App;
