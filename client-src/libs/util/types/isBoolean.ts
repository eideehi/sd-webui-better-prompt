export function isBoolean(arg: unknown): arg is boolean {
  return arg != null && typeof arg === "boolean";
}
