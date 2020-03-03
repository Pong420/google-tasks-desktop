import { UnionCRUDActions } from '@pong420/redux-crud';
import { useActions } from '../../hooks/useActions';

export function authenticated() {
  return {
    type: 'AUTHENTICATED' as const
  };
}

export function logout() {
  return {
    type: 'LOGOUT' as const
  };
}

const actions = { authenticated, logout };

export type AuthActions = UnionCRUDActions<typeof actions>;

export const useAuthActions = () => useActions({ authenticated, logout });
