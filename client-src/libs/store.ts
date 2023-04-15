export type Readable<T> = {
  read(): T | null;
  readOrDefault(defaultValue: T): T;
  with(callback: (value: T) => void): void;
  subscribe(callback: (value: T) => void): void;
};

export type Writable<T> = {
  write(value: T): boolean;
};

export type Store<T> = Readable<T> & Writable<T>;

/**
 * Creates a default value accessor with get and set methods that operate on a value of type T.
 *
 * @returns An object with get and set methods for the default value.
 */
export function createEmptyStore<T>(): Store<T> {
  return {
    read: () => null,
    readOrDefault: (defaultValue) => defaultValue,
    with: () => void 0,
    write: () => false,
    subscribe: () => void 0,
  };
}

export function createStore<T>(obj: {
  read: () => T;
  write: (value: T) => boolean;
}): Store<T> {
  const listeners: Array<(value: T) => void> = [];
  return {
    ...obj,
    readOrDefault: (defaultValue) => {
      const value = obj.read();
      return value != null ? value : defaultValue;
    },
    with: (callback) => callback(obj.read()),
    subscribe: (callback) => listeners.push(callback),
    write: (value) => {
      obj.write(value);
      listeners.forEach((listener) => listener(value));
      return true;
    },
  };
}
