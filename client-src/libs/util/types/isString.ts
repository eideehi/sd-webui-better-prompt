export function isString(arg: unknown): arg is string {
  return arg != null && typeof arg === "string";
}
