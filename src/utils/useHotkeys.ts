import { useEffect } from 'react';
import hotkeys, { KeyHandler } from 'hotkeys-js';

hotkeys.filter = () => true;

export function useHotkeys(
  key: string,
  method: (...args: Parameters<KeyHandler>) => any,
  focused: boolean
) {
  useEffect(() => {
    const handler: KeyHandler = (evt, hotkeysEvent) => {
      method(evt, hotkeysEvent) === false && evt.preventDefault();
    };

    if (focused) {
      hotkeys(key, handler);
      return () => {
        hotkeys.unbind(key, handler);
      };
    }
  }, [focused, key, method]);
}
