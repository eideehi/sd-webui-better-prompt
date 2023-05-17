/**
 * Gets the first DOM element that matches the given selector, starting from the root element (if provided) or the document body.
 *
 * @param selector - A CSS selector string to match against.
 * @returns The first element that matches the selector, or null if no matching element is found.
 */
export function getElement(selector: string): Nullable<HTMLElement>;

/**
 * Gets the first DOM element that matches the given selector, starting from the given root element.
 *
 * @param root - The root element to start the search from.
 * @param selector - A CSS selector string to match against.
 * @returns The first element that matches the selector, or null if no matching element is found.
 */
export function getElement(root: Element, selector: string): Nullable<HTMLElement>;

export function getElement(arg1: string | Element, arg2?: string): HTMLElement | null {
  if (typeof arg1 === "string") {
    return gradioApp().querySelector(arg1);
  } else if (arg2 != null) {
    return arg1.querySelector(arg2);
  }
  return null;
}
