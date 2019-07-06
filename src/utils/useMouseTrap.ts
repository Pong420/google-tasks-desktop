import { useEffect, RefObject } from 'react';
import mousetrap from 'mousetrap';

type Callback = Parameters<MousetrapStatic['bind']>[1];

export function useMouseTrap(
  input: RefObject<HTMLElement>,
  key: string,
  method: Callback
) {
  useEffect(() => {
    if (input.current) {
      const instance = mousetrap(input.current);

      instance.bind(key, method);
      return () => {
        instance.unbind(key);
      };
    }
  }, [input, key, method]);
}
