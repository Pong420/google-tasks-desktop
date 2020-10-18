import { Dispatch } from 'react';
import { ActionCreators } from './crudAction';

export type Dispatched<A extends ActionCreators> = {
  [X in keyof A]: (...args: Parameters<A[X]>) => void;
};

export function bindDispatch<A extends ActionCreators>(
  creators: A,
  dispatch: Dispatch<any>
) {
  const handler = {} as Dispatched<A>;
  for (const key in creators) {
    const creator = creators[key];
    handler[key] = (...args: Parameters<typeof creator>) => {
      dispatch(creator(...args));
    };
  }

  return handler;
}
