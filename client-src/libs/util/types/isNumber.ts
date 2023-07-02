export function isNumber(arg: unknown): arg is number {
  return arg != null && typeof arg === "number";
}
