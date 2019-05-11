export function compare(a?: string | number, b?: string | number) {
  if (a || b) {
    if (!a) return 1;
    if (!b) return -1;

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }

    return a > b ? 1 : -1;
  }

  return 0;
}
