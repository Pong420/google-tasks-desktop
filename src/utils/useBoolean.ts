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

  return [
    flag,
    {
      on: () => setFlag(true),
      off: () => setFlag(false),
      toggle: useCallback(() => setFlag(!flag), [flag])
    }
  ];
}
