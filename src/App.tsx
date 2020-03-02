import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AppRegion } from './components/AppRegion';
import { Home } from './pages/Home';
import { PATHS } from './constants';

const App = () => (
  <>
    <AppRegion />
    <Router>
      <Switch>
        <Route exact path={PATHS.HOME} component={Home} />
      </Switch>
    </Router>
  </>
);

export default App;
