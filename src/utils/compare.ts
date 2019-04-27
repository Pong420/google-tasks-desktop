export function compare(a?: string, b?: string) {
  return a || b ? (!a ? 1 : !b ? -1 : a.localeCompare(b)) : 0;
}
