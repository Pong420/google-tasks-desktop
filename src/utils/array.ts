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

export function swap<T>(arr: T[], oldIndex: number, newIndex: number) {
  const clone = arr.slice();
  const cache = clone[oldIndex];
  clone[oldIndex] = clone[newIndex];
  clone[newIndex] = cache;

  return clone;
}

// credit: https://github.com/sindresorhus/array-move
export function move<T>(arr: T[], from: number, to: number) {
  const clone = arr.slice();
  clone.splice(to < 0 ? clone.length + to : to, 0, clone.splice(from, 1)[0]);
  return clone;
}
