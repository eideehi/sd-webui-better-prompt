import { omitNulls } from "@/libs/util/common/omitNulls";

/**
 * Adds one or more CSS classes to an element.
 *
 * @param element - The element to add classes to.
 * @param classes - One or more class names to add to the element. Null and undefined values will be omitted.
 */
export function addClasses(element: Element, ...classes: Nullable<string>[]): void {
  element.classList.add(...omitNulls(classes));
}
