import { omitNulls } from "#/util/array";

/**
 * Removes one or more CSS classes from an element.
 *
 * @param element - The element to remove classes from.
 * @param classes - One or more class names to remove from the element. Null and undefined values will be omitted.
 */
export function removeClasses(element: Element, ...classes: Nullable<string>[]): void {
  element.classList.remove(...omitNulls(classes));
}
