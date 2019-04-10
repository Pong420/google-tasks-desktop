import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { TitleBar } from './components/TitleBar';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <TitleBar />
    <Auth />
    <Switch>
      <Route exact path={PATHS.TASKLIST} component={TaskList} />
      <Redirect to={PATHS.TASKLIST} />
    </Switch>
  </Router>
);

export default App;
