import { CRUDState } from './crudReducer';

export interface PaginateState<S extends CRUDState<unknown, any>> {
  ids: S['ids'];
  list: S['list'];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
  hasData: boolean;
}

export function paginateSelector<S extends CRUDState<unknown, any>>({
  list,
  ids,
  pageNo,
  pageSize,
  params,
  total
}: S): PaginateState<S> {
  const start = (pageNo - 1) * pageSize;
  const _list = list.slice(start, start + pageSize);
  const _ids = ids.slice(start, start + pageSize);

  let hasData = !!_list.length;
  for (const item of _list) {
    if (item === null) {
      hasData = false;
      break;
    }
  }

  return {
    list: _list,
    ids: _ids,
    pageNo,
    pageSize,
    total,
    params,
    hasData
  };
}
