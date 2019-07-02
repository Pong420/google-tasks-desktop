import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState, authenticate, getToken } from '../../store';
import { Input } from '../Mui/Input';
import { FileUpload } from './FileUpload';
import { useInput } from '../../utils/useInput';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { OAuth2Keys } from '../../api';
import Button from '@material-ui/core/Button';

const mapStateToProps = ({ auth: { loggedIn, autoLogin } }: RootState) => ({
  loggedIn,
  autoLogin
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ authenticate, getToken }, dispatch);

export function AuthComponent({
  loggedIn,
  autoLogin,
  authenticate,
  getToken
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const code = useInput('');
  const installed = !!OAuth2Keys;

  useEffect(() => {
    installed && autoLogin && authenticate();
  }, [authenticate, autoLogin, installed]);

  if (installed && (autoLogin || loggedIn)) {
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
