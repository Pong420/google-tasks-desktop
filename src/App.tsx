import React from 'react';
import { Route, Switch, Redirect, generatePath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppRegion } from './components/AppRegion';
import { PrivateRoute } from './components/PrivateRoute';
import { Auth } from './pages/Auth';
import { TaskList } from './pages/TaskList';
import { PATHS } from './constants';
import { titleBarSelector } from './store';

const App = () => {
  const titleBar = useSelector(titleBarSelector);

  return (
    <>
      {titleBar === 'native' ? null : <AppRegion />}
      <>
        <Switch>
          <Route path={PATHS.AUTH} component={Auth} />
          <PrivateRoute path={PATHS.TASKLIST} component={TaskList} />
          <Redirect to={generatePath(PATHS.TASKLIST, {})} />
        </Switch>
      </>
    </>
  );
};

export default App;
