import React, { useEffect } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState, NextWorkActionCreator } from '../../store';
import WifiOffIcon from '@material-ui/icons/WifiOff';

const mapStateToProps = ({ network }: RootState) => ({ ...network });
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(NextWorkActionCreator, dispatch);

export function NetworkComponent({
  online,
  offline,
  isOnline
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  useEffect(() => {
    addEventListener('online', online);
    addEventListener('offline', offline);
    return () => {
      removeEventListener('online', online);
      removeEventListener('offline', offline);
    };
  }, [offline, online]);

  if (isOnline) {
    return null;
  }

  return (
    <div className="network">
      <WifiOffIcon classes={{ root: 'wifi-off-icon' }} />
      <div>Waiting for network connection</div>
    </div>
  );
}

export const Network = connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkComponent);
