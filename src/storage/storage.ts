import low, { AdapterOptions } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import LocalStorage from 'lowdb/adapters/LocalStorage';

export function createFileStorage<T extends {}>(
  source: string,
  options?: AdapterOptions<T>
) {
  const adapter = new FileSync<T>(source, options);
  return low(adapter);
}

export function createLocalStorage<T extends {}>(
  source: string,
  options?: AdapterOptions<T>
) {
  const adapter = new LocalStorage<T>(source, options);
  return low(adapter);
}
