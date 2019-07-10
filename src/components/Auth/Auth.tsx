import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Input } from '../Mui/Input';
import { FileUpload } from './FileUpload';
import { RootState, authenticate, getToken } from '../../store';
import { useInput } from '../../utils/useInput';
import { OAuth2Keys } from '../../api';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import Button from '@material-ui/core/Button';

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
  loggedIn,
  getToken
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & { children: ReactElement }) {
  const code = useInput('');

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
          <form onSubmit={authenticate}>
            Paste the code here:
            <Input
              {...code}
              autoFocus
              fullWidth
              className="filled bottom-border"
            />
            <div>
              <Button onClick={authenticate}>Get Code</Button>
              <Button
                className="auth-confirm-button"
                onClick={() => getToken(code.value)}
              >
                Confirm
              </Button>
            </div>
          </form>
        ) : (
          <FileUpload />
        )}
      </div>
    </div>
  );
}

export const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
