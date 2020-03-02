import { useState, useMemo } from 'react';

export function useBoolean(initialState = false) {
  const [flag, setFlag] = useState(initialState);
  const actions = useMemo(
    () => [
      () => setFlag(true),
      () => setFlag(false),
      () => setFlag(flag => !flag)
    ],
    []
  );
  return [flag, ...actions] as const;
}
