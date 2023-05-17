/**
 * Removes all child elements that match the specified selector from the given parent element. If no selector is provided, all child elements are removed.
 *
 * @param parent - The parent element to remove child elements from.
 * @param selector - The CSS selector used to match child elements to remove.
 */
export function removeAllChild(parent: Element, selector?: string): void {
  if (!selector) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  } else {
    const elementsToRemove = parent.querySelectorAll(selector);
    elementsToRemove.forEach((element) => {
      parent.removeChild(element);
    });
  }
}
