import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TitleBar } from './components/TitleBar';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import { PATHS } from './constants';

const App = () => (
  <>
    <TitleBar />
    <Auth />
    <Switch>
      <Route exact path={PATHS.TASKLIST} component={TaskList} />
      <Redirect to={PATHS.TASKLIST} />
    </Switch>
  </>
);

export default App;
