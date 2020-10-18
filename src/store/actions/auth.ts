import { useActions, GetCreatorsAction } from '../../hooks/crud-reducer';

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

export type AuthActions = GetCreatorsAction<typeof actions>;

export const useAuthActions = () => useActions({ authenticated, logout });
