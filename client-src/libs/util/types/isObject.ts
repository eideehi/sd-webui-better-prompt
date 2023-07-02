export function isObject(arg: unknown): arg is object {
  return arg != null && typeof arg === "object";
}
