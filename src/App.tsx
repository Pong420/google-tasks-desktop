import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Auth } from './components/Auth';
import { Main } from './components/Main';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.AUTH} component={Auth} />
      <Route path={PATHS.TASKLIST} component={Main} />
    </Switch>
  </Router>
);

export default App;
