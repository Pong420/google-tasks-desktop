import { useState, useCallback } from 'react';

type Props = [
  boolean,
  {
    on(): void;
    off(): void;
    toggle(): void;
  }
];

export function useBoolean(initialState: boolean = false): Props {
  const [flag, setFlag] = useState(initialState);
  const on = useCallback(() => setFlag(true), []);
  const off = useCallback(() => setFlag(false), []);
  const toggle = useCallback(() => setFlag(flag => !flag), []);

  return [flag, { on, off, toggle }];
}
