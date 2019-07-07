export function insert<T>(arr: T[], val: T, index: number) {
  return [...arr.slice(0, index), val, ...arr.slice(index)];
}
export function insertAfter<T>(arr: T[], val: T, prev?: T) {
  const index = prev ? arr.indexOf(prev) + 1 : 0;
  return insert(arr, val, index);
}

export function remove<T>(arr_: T[], val: any) {
  const arr = arr_.slice();

  const index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
}
