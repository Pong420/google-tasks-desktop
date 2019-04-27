import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState, AuthActionCreators, AuthsState } from '../../store';
import { Input } from '../Mui/Input';
import { useInput } from '../../utils/useInput';
import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import Button from '@material-ui/core/Button';

const mapStateToProps = ({ auth }: RootState) => ({ ...auth });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(AuthActionCreators, dispatch);

export function AuthComponent({
  loggedIn,
  autoLogin,
  authenticate,
  getToken
}: AuthsState & typeof AuthActionCreators) {
  const code = useInput('');

  useEffect(() => {
    autoLogin && authenticate();
  }, [authenticate, autoLogin]);

  if (autoLogin || loggedIn) {
    return null;
  }

  return (
    <div className="auth">
      <LogoSvg className="logo" />
      <h4>Unoffical Google Task Clinet</h4>
      <form action="">
        Paste the code here:
        <Input {...code} autoFocus fullWidth className="filled bottom-border" />
        <div>
          <Button onClick={authenticate}>Get Code</Button>
          <Button color="secondary" onClick={() => getToken(code.value)}>
            Confirm
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
