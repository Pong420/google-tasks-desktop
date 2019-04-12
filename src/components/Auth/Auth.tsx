import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState, AuthActionCreators, AuthsState } from '../../store';

const mapStateToProps = ({ auth }: RootState) => ({ ...auth });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(AuthActionCreators, dispatch);

export function AuthComponent({
  autoLogin,
  authenticate
}: AuthsState & typeof AuthActionCreators) {
  useEffect(() => {
    autoLogin && authenticate();
  }, [authenticate, autoLogin]);

  return null;
}

export const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
