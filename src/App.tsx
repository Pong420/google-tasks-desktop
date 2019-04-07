import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './components/Home';
import { PATHS } from './constants';

const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
    </Switch>
  </Router>
);

export default App;
