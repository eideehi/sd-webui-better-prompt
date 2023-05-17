/**
 * Checks if a given child element is a descendant of a given parent element.
 *
 * @param parent - The DOM element to check if it's an ancestor.
 * @param child - The DOM element to check if it's a descendant.
 * @returns true if the child is a descendant of the parent, false otherwise.
 */
export function hasChild(parent: Element, child: Element): boolean {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
