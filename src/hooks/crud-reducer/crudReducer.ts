/* eslint-disable @typescript-eslint/ban-types */

import {
  Key,
  CRUDActions,
  CRUDActionTypes,
  PaginatePayload,
  DefaultCRUDActionTypes,
  isAction,
  List
} from './crudAction';

export interface CRUDState<I, Prefill extends boolean = true> {
  ids: string[];
  byIds: Record<string, I>;
  list: Prefill extends true ? Array<I | null> : I[];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
}

export type CRUDReducer<
  I,
  K extends Key<I>,
  Prefill extends boolean = true,
  M extends CRUDActionTypes = CRUDActionTypes
> = (
  state: CRUDState<I, Prefill>,
  action: CRUDActions<I, K, M>
) => CRUDState<I, Prefill>;

export interface CreateCRUDReducerOptions<
  M extends CRUDActionTypes = CRUDActionTypes
> {
  prefill?: boolean;
  actionTypes?: M;
  keyGenerator?: (index: number) => string;
}

export const defaultKeyGenerator = (() => {
  let count = 0;
  return function () {
    count++;
    return `mock-${count}`;
  };
})();

export function parsePaginatePayload<I>(payload: PaginatePayload<I>) {
  return Array.isArray(payload)
    ? {
        total: payload.length,
        data: payload,
        pageNo: 1
      }
    : payload;
}

export function createCRUDReducer<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes
>(
  key: K,
  options: CreateCRUDReducerOptions<M> & { prefill: false }
): [CRUDState<I, false>, CRUDReducer<I, K, false>];

export function createCRUDReducer<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes
>(
  key: K,
  options?: CreateCRUDReducerOptions<M>
): [CRUDState<I, true>, CRUDReducer<I, K, true>];

export function createCRUDReducer<
  I,
  K extends Key<I>,
  M extends CRUDActionTypes = CRUDActionTypes
>(
  key: K,
  options?: CreateCRUDReducerOptions<M>
): [CRUDState<I, boolean>, CRUDReducer<I, K, boolean, M>] {
  const defaultState: CRUDState<I, boolean> = {
    byIds: {},
    ids: [],
    list: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    params: {}
  };

  const {
    prefill = true,
    keyGenerator = defaultKeyGenerator,
    actionTypes = DefaultCRUDActionTypes as M
  } = options || {};

  const reducer: CRUDReducer<I, K, boolean, M> = (
    state = defaultState,
    action
  ) => {
    if (isAction(actionTypes, action, 'PAGINATE')) {
      return (() => {
        const {
          data,
          pageNo,
          total,
          pageSize = state.pageSize
        } = parsePaginatePayload(action.payload);

        if (prefill === false) {
          return reducer(state, { type: actionTypes['LIST'], payload: data });
        }

        const start = (pageNo - 1) * pageSize;

        const insert = <T1, T2>(arr: T1[], ids: T2[]) => {
          return [
            ...arr.slice(0, start),
            ...ids,
            ...arr.slice(start + pageSize)
          ];
        };

        const { list, ids, byIds } = reducer(defaultState, {
          type: actionTypes['LIST'],
          payload: data
        });

        const length = total - state.ids.length;

        return {
          ...state,
          total,
          pageNo,
          pageSize,
          byIds: {
            ...state.byIds,
            ...byIds
          },
          ids: insert(
            [
              ...state.ids,
              ...Array.from({ length }, (_, index) => keyGenerator(index))
            ],
            ids
          ),
          list: insert(
            [...state.list, ...Array.from({ length }, () => null)],
            list
          )
        };
      })();
    }

    if (isAction(actionTypes, action, 'LIST')) {
      return (action as List<'', I>).payload.reduce(
        (state, payload) =>
          reducer(state, { type: actionTypes['CREATE'], payload }),
        defaultState
      );
    }

    if (isAction(actionTypes, action, 'CREATE')) {
      const id: string = action.payload[key] as any;
      return {
        ...state,
        byIds: { ...state.byIds, [id]: action.payload },
        list: [...state.list, action.payload],
        ids: [...state.ids, id]
      };
    }

    if (isAction(actionTypes, action, 'UPDATE')) {
      const id = action.payload[key] as string;
      const updated = { ...state.byIds[id], ...action.payload };
      const index = state.ids.indexOf(id);
      return index === -1
        ? state
        : {
            ...state,
            byIds: { ...state.byIds, [id]: updated },
            list: [
              ...state.list.slice(0, index),
              updated,
              ...state.list.slice(index + 1)
            ]
          };
    }

    if (isAction(actionTypes, action, 'DELETE')) {
      const id = action.payload[key];
      const index = state.ids.indexOf(id);
      const { [id]: _deleted, ...byIds } = state.byIds;
      return {
        ...state,
        byIds,
        ids: removeFromArray(state.ids, index),
        list: removeFromArray(state.list, index)
      };
    }

    if (isAction(actionTypes, action, 'PARAMS')) {
      const { pageNo, pageSize, ...params } = action.payload;
      const toNum = (value: unknown, num: number) =>
        typeof value === 'undefined' || isNaN(Number(value))
          ? num
          : Number(value);

      return {
        ...state,
        pageNo: toNum(pageNo, state.pageNo),
        pageSize: toNum(pageSize, state.pageSize),
        params
      };
    }

    if (isAction(actionTypes, action, 'RESET')) {
      return defaultState;
    }

    return state;
  };

  return [defaultState, reducer];
}

export function removeFromArray<T>(arr: T[], index: number) {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}
