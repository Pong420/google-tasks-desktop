import { UnionCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';

// export enum AuthActionTypes {
//   AUTHENTICATED = 'AUTHENTICATED',
//   LOGOUT = 'LOGOUT'
// }

export function authenticate() {
  return {
    type: 'AUTHENTICATED' as const
  };
}

export function logout() {
  return {
    type: 'LOGOUT' as const
  };
}

const actions = { authenticate, logout };

export type AuthActions = UnionCRUDActions<typeof actions>;

export const useAuthActions = () => useActions({ authenticate, logout });
