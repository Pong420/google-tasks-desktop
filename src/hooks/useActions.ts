/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from 'react';
import { AnyAction } from 'redux';
import { useDispatch } from 'react-redux';

interface Actions {
  [k: string]: (...args: any[]) => AnyAction;
}

export function useActions<A extends Actions>(actions: A): A {
  const dispatch = useDispatch();

  return useMemo(() => {
    const handler: any = {};

    for (const key in actions) {
      const action = actions[key];
      handler[key] = (...args: Parameters<typeof action>) => {
        dispatch(action(...args));
      };
    }

    return handler as A;
  }, [actions, dispatch]);
}
