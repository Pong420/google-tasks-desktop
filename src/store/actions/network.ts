export enum NetworkActionTypes {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

interface Online {
  type: NetworkActionTypes.ONLINE;
}

interface Offline {
  type: NetworkActionTypes.OFFLINE;
}

export type NetworkActions = Online | Offline;

export const NextWorkActionCreators = {
  online(): Online {
    return {
      type: NetworkActionTypes.ONLINE
    };
  },
  offline(): Offline {
    return {
      type: NetworkActionTypes.OFFLINE
    };
  }
};
