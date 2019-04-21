import { NetworkActions, NetworkActionTypes } from '../actions/network';

export interface NetworkState {
  isOnline: boolean;
}

const initialState: NetworkState = {
  isOnline: navigator.onLine
};

export default function(
  state = initialState,
  action: NetworkActions
): NetworkState {
  switch (action.type) {
    case NetworkActionTypes.ONLINE:
      return {
        ...state,
        isOnline: true
      };

    case NetworkActionTypes.OFFLINE:
      return {
        ...state,
        isOnline: false
      };

    default:
      return state;
  }
}
