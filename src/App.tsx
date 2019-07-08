import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <Auth>
      <Switch>
        <Route exact path={PATHS.TASKLIST} component={TaskList} />
        <Redirect to={PATHS.TASKLIST} />
      </Switch>
    </Auth>
  </>
);

export default App;
