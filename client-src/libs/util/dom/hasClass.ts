import { omitNulls } from "@/libs/util/array";

export function hasClass(element: Element, ...classes: Nullable<string>[]): boolean {
  return omitNulls(classes).every((clazz) => element.classList.contains(clazz));
}
