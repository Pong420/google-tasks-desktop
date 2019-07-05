import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState, authenticate, getToken } from '../../store';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { OAuth2Keys } from '../../api';

const mapStateToProps = ({ auth: { loggedIn, autoLogin } }: RootState) => ({
  loggedIn,
  autoLogin
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ authenticate, getToken }, dispatch);

const installed = !!OAuth2Keys;

export function AuthComponent({
  autoLogin,
  authenticate,
  children,
  loggedIn
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & { children: ReactElement }) {
  useEffect(() => {
    installed && autoLogin && authenticate();
  }, [authenticate, autoLogin]);

  if (loggedIn && children) {
    return children;
  }

  if (installed && autoLogin) {
    return null;
  }

  return (
    <div className="auth">
      <div className="auth-header">
        <LogoSvg className="logo" />
        <h4>Unoffical Google Task Clinet</h4>
      </div>
      <div className="auth-content">
        {installed ? (
          <form onSubmit={authenticate}>Paste the code here:</form>
        ) : null}
      </div>
    </div>
  );
}

export const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
