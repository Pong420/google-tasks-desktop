export enum AuthActionTypes {
  AUTHENTICATE = 'AUTHENTICATE',
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  GET_TOKEN = 'GET_TOKEN',
  GET_TOKEN_FAILURE = 'GET_TOKEN_FAILURE'
}

export interface Authenticate {
  type: AuthActionTypes.AUTHENTICATE;
}

export interface AuthenticateSuccess {
  type: AuthActionTypes.AUTHENTICATION_SUCCESS;
}

export interface AuthenticateFailure {
  type: AuthActionTypes.AUTHENTICATION_FAILURE;
}

export interface GetToken {
  type: AuthActionTypes.GET_TOKEN;
  payload: string;
}

export interface GetTokenFailure {
  type: AuthActionTypes.GET_TOKEN_FAILURE;
}

export type AuthActions =
  | Authenticate
  | AuthenticateSuccess
  | AuthenticateFailure
  | GetToken
  | GetTokenFailure;

export const AuthActionCreators = {
  authenticate(): Authenticate {
    return {
      type: AuthActionTypes.AUTHENTICATE
    };
  },
  getToken(payload: string): GetToken {
    return {
      type: AuthActionTypes.GET_TOKEN,
      payload
    };
  }
};
