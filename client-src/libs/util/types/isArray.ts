export function isArray(arg: unknown): arg is unknown[];

export function isArray<T>(arg: unknown, check: (element: unknown) => element is T): arg is T[];

export function isArray<T>(arg1: unknown, arg2?: (element: unknown) => element is T): arg1 is T[] {
  if (arg1 == null || !Array.isArray(arg1)) return false;
  if (arg2 == null) return true;
  return arg1.every(arg2);
}
