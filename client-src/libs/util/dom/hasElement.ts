import { getElement } from "./getElement";

/**
 * Checks if an element with the given CSS selector exists in the DOM.
 *
 * @param selector - The CSS selector to search for.
 * @returns `true` if an element with the given selector exists, `false` otherwise.
 */
export function hasElement(selector: string): boolean;

/**
 * Checks if an element with the given CSS selector exists within the given root element in the DOM.
 *
 * @param root - The root element to search within.
 * @param selector - The CSS selector to search for.
 * @returns `true` if an element with the given selector exists within the given root element, `false` otherwise.
 */
export function hasElement(root: Element, selector: string): boolean;

export function hasElement(arg1: string | Element, arg2?: string): boolean {
  if (typeof arg1 === "string") {
    return getElement(arg1) != null;
  } else if (arg2 != null) {
    return getElement(arg1, arg2) != null;
  }
  return false;
}
