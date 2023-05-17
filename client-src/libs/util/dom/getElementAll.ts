/**
 * Gets all DOM elements that match a specified CSS selector, under a gradio app root element.
 *
 * @param selector - The CSS selector to use to find the elements.
 * @returns An array of all elements that match the selector.
 */
export function getElementAll(selector: string): HTMLElement[];

/**
 * Gets all DOM elements that match a specified CSS selector under a specified root element.
 *
 * @param root - The root element under which to search for matching elements.
 * @param selector - The CSS selector to use to find the elements.
 * @returns An array of all elements that match the selector under the specified root element.
 */
export function getElementAll(root: Element, selector: string): HTMLElement[];

export function getElementAll(arg1: string | Element, arg2?: string): HTMLElement[] {
  if (typeof arg1 === "string") {
    return Array.from(gradioApp().querySelectorAll(arg1));
  } else if (arg2 != null) {
    return Array.from(arg1.querySelectorAll(arg2));
  }
  return [];
}
