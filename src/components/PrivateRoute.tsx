import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { PATHS } from '../constants';

export function PrivateRoute(props: RouteProps) {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  return loggedIn ? <Route {...props} /> : <Redirect to={PATHS.AUTH} />;
}
