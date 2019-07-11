import { useEffect } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NextWorkActionCreators } from '../store';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(NextWorkActionCreators, dispatch);

export function NetworkComponent({
  online,
  offline
}: ReturnType<typeof mapDispatchToProps>) {
  useEffect(() => {
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, [offline, online]);

  return null;
}

export const Network = connect(
  null,
  mapDispatchToProps
)(NetworkComponent);
