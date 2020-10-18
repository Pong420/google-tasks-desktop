/* eslint-disable @typescript-eslint/ban-types */

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type Key<I> = AllowedNames<I, string>;

export interface AnyAction {
  type: string;
  [extraProps: string]: any;
}

export interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

export type GetCreatorsAction<
  T extends Record<string, (...args: any[]) => any>
> = ReturnType<T[keyof T]>;

export type CRUDActionType =
  | 'LIST'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PAGINATE'
  | 'PARAMS'
  | 'RESET';

export type CRUDActionTypes<Type extends string = any> = {
  [K in CRUDActionType]?: Type;
};

export type CustomActionTypes<
  M extends Partial<CRUDActionTypes> = CRUDActionTypes
> = M & Omit<typeof DefaultCRUDActionTypes, keyof M>;

export type UpdatePayload<I, K extends Key<I>> = Partial<I> &
  { [T in K]: string };

export type PaginatePayload<I> =
  | I[]
  | {
      data: I[];
      total: number;
      pageNo: number;
      pageSize?: number;
    };

export type List<Type extends string, I> = {
  type: Type;
  payload: I[];
};

export type Create<Type extends string, I> = {
  type: Type;
  payload: I;
};

export interface Update<Type extends string, I, K extends Key<I>> {
  type: Type;
  payload: UpdatePayload<I, K>;
}

export interface Delete<Type extends string, I, K extends Key<I>> {
  type: Type;
  payload: { [T in K]: string };
}

export interface Paginate<Type extends string, I> {
  type: Type;
  payload: PaginatePayload<I>;
}

export interface Params<Type extends string> {
  type: Type;
  payload: Record<string, any>;
}

export interface Reset<Type extends string> {
  type: Type;
}

export type CRUDActionCreators<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes
> = {
  list: (payload: I[]) => List<M['LIST'], I>;
  create: (payload: I) => Create<M['CREATE'], I>;
  update: (
    payload: Update<string, I, K>['payload']
  ) => Update<M['UPDATE'], I, K>;
  delete: (payload: { [T in K]: string }) => Delete<M['DELETE'], I, K>;
  paginate: (payload: PaginatePayload<I>) => Paginate<M['PAGINATE'], I>;
  params: (payload: Record<string, any>) => Params<M['PARAMS']>;
  reset: () => Reset<M['RESET']>;
};

export type CRUDActions<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes
> = GetCreatorsAction<CRUDActionCreators<I, K, M>>;

export type ExtractAction<
  CustomActionTypes extends AnyAction,
  T2 extends CustomActionTypes['type']
> = CustomActionTypes extends { type: T2 } ? CustomActionTypes : never;

export function isAction<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes,
  BaseType extends keyof M = keyof M
>(
  actionTypes: M,
  action: CRUDActions<I, K, M>,
  type: BaseType
): action is ExtractAction<CRUDActions<I, K, M>, M[BaseType]> {
  return action.type === actionTypes[type];
}

export const DefaultCRUDActionTypes = {
  LIST: 'LIST',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  PAGINATE: 'PAGINATE',
  PARAMS: 'PARAMS',
  RESET: 'RESET'
} as const;

export function getCRUDActionsCreator<I, K extends Key<I>>() {
  // prettier-ignore
  function create(): [CRUDActionCreators<I, K, typeof DefaultCRUDActionTypes>, typeof DefaultCRUDActionTypes]
  // prettier-ignore
  function create<M extends CRUDActionTypes = CRUDActionTypes>(actionTypes: M): [CRUDActionCreators<I, K, CustomActionTypes<M>>, CustomActionTypes<M>]
  // prettier-ignore
  function create<M extends CRUDActionTypes = CRUDActionTypes>(actionTypes = DefaultCRUDActionTypes as M) {
    actionTypes = { ...DefaultCRUDActionTypes, ...actionTypes };
    const creators: CRUDActionCreators<I, K, CustomActionTypes<M>> = {
      list: payload => ({ type: actionTypes['LIST'], payload }),
      create: payload => ({ type: actionTypes['CREATE'], payload }),
      update: payload => ({ type: actionTypes['UPDATE'], payload }),
      delete: payload => ({ type: actionTypes['DELETE'], payload }),
      paginate: payload => ({ type: actionTypes['PAGINATE'], payload }),
      params: payload => ({ type: actionTypes['PARAMS'], payload }),
      reset: () => ({ type: actionTypes['RESET'] })
    };
    return [creators, actionTypes] as const;
  }
  return create;
}
