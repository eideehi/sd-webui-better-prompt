import { addClasses } from "./addClasses";
import { removeClasses } from "./removeClasses";

/**
 * Adds or removes one or more CSS classes from an element based on a boolean value.
 *
 * @param element - The element to add or remove classes from.
 * @param set - Whether to add or remove the classes. If true, classes will be added; if false, classes will be removed.
 * @param classes - One or more class names to add or remove from the element. Null and undefined values will be omitted.
 */
export function applyClasses(element: Element, set: boolean, ...classes: Nullable<string>[]): void {
  if (set) {
    addClasses(element, ...classes);
  } else {
    removeClasses(element, ...classes);
  }
}
