import { useCallback } from 'react';

export function useAdvancedCallback<T extends (...args: any[]) => any>(
  callback: T,
  args: Parameters<T>
): () => void {
  return useCallback(() => callback(...args), [args, callback]);
}
