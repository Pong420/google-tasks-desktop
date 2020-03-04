import { useEffect } from 'react';
import mousetrap from 'mousetrap';

type Params = Parameters<MousetrapStatic['bind']>;

export function useMouseTrap(
  key: Params[0],
  method: Params[1],
  preventDefault = true
) {
  useEffect(() => {
    if (key !== '') {
      const instance = mousetrap(document.body);
      const handler = (...args: Parameters<Params[1]>) => {
        method(...args);
        return preventDefault ? false : true;
      };
      instance.bind(key, handler);
      return () => {
        instance.unbind(key);
      };
    }
  }, [key, method, preventDefault]);
}
