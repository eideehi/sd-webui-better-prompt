import { omitNulls } from "./common";

/**
 * Gets the first DOM element that matches the given selector, starting from the root element (if provided) or the document body.
 *
 * @param selector - A CSS selector string to match against.
 * @returns The first element that matches the selector, or null if no matching element is found.
 */
export function getElement(selector: string): HTMLElement | null;

/**
 * Gets the first DOM element that matches the given selector, starting from the given root element.
 *
 * @param root - The root element to start the search from.
 * @param selector - A CSS selector string to match against.
 * @returns The first element that matches the selector, or null if no matching element is found.
 */
export function getElement(root: Element, selector: string): HTMLElement | null;

export function getElement(arg1: string | Element, arg2?: string): HTMLElement | null {
  if (typeof arg1 === "string") {
    return gradioApp().querySelector(arg1);
  } else if (arg2 != null) {
    return arg1.querySelector(arg2);
  }
  return null;
}

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

/**
 * Adds one or more CSS classes to an element.
 *
 * @param element - The element to add classes to.
 * @param classes - One or more class names to add to the element. Null and undefined values will be omitted.
 */
export function addClasses(element: Element, ...classes: Nullable<string>[]): void {
  element.classList.add(...omitNulls(classes));
}

/**
 * Removes one or more CSS classes from an element.
 *
 * @param element - The element to remove classes from.
 * @param classes - One or more class names to remove from the element. Null and undefined values will be omitted.
 */
export function removeClasses(element: Element, ...classes: Nullable<string>[]): void {
  element.classList.remove(...omitNulls(classes));
}

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

/**
 * Toggles one or more CSS classes of an element.
 *
 * @param element - The target element to toggle the CSS classes.
 * @param classes - One or more CSS classes to toggle.
 */
export function toggleClasses(element: Element, ...classes: Nullable<string>[]): void {
  omitNulls(classes).forEach((clazz) => {
    element.classList.toggle(clazz);
  });
}

export function hasClass(element: Element, ...classes: Nullable<string>[]): boolean {
  return omitNulls(classes).every((clazz) => element.classList.contains(clazz));
}

/**
 * Escapes characters that cannot be used for the ID of a DOM element by converting them to their Unicode number representation.
 * Colons and periods are also converted because they can cause issues with query selectors.
 *
 * @param str - The string to escape illegal ID characters from.
 * @returns A new string with illegal ID characters escaped as Unicode numbers.
 */
export function escapeIllegalIdChars(str: string): string {
  const illegalCharsRegex = /[^\w\-_]/g;
  return str.replace(
    illegalCharsRegex,
    (match) => `u${match.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
}

/**
 * Gets the on-screen position of a given DOM element, taking into account the variation in position due to scrolling.
 *
 * @param element - The DOM element to get the on-screen position of.
 * @returns An object with the `top` and `left` properties, representing the element's position relative to the viewport.
 */
export function getPosition(element: Element): {
  top: number;
  left: number;
  bottom: number;
  right: number;
} {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const top = rect.top + scrollTop;
  const left = rect.left + scrollLeft;
  return { top, left, bottom: top + rect.height, right: left + rect.width };
}

export type Direction2D = "up" | "down" | "left" | "right";

export function getNextElementInDirection(
  element: HTMLElement | null,
  direction: Direction2D
): HTMLElement | null {
  const parent = element?.parentElement;
  if (!element || !parent) {
    return null;
  }

  type DomData = Omit<DOMRect, "x" | "y" | "toJSON">;

  const getDomData = (element: HTMLElement): DomData => {
    const rect = element.getBoundingClientRect();
    const { left, right, top, bottom, width, height } = rect;
    return { left, right, top, bottom, width, height };
  };

  const isInBoundsX = (origin: DomData, target: DomData) => {
    return origin.left <= target.right && origin.right >= target.left;
  };

  const isInBoundsY = (origin: DomData, target: DomData) => {
    return origin.top <= target.bottom && origin.bottom >= target.top;
  };

  const isValidPosition = (origin: DomData, target: DomData, direction: Direction2D) => {
    return (
      (direction === "up" && origin.top > target.bottom && isInBoundsX(target, origin)) ||
      (direction === "down" && origin.bottom < target.top && isInBoundsX(target, origin)) ||
      (direction === "left" && origin.left > target.right && isInBoundsY(target, origin)) ||
      (direction === "right" && origin.right < target.left && isInBoundsY(target, origin))
    );
  };

  const getAxisDistance = (origin: DomData, target: DomData, direction: Direction2D) => {
    switch (direction) {
      case "up":
        return origin.top - target.top;
      case "down":
        return target.top - origin.top;
      case "left":
        return origin.left - target.left;
      case "right":
        return target.left - origin.left;
    }
  };

  const getDistance = (origin: DomData, target: DomData, direction: Direction2D) => {
    let d1: number;
    let d2: number;
    switch (direction) {
      case "up":
        d1 = Math.hypot(origin.left - target.left, origin.top - target.bottom);
        d2 = Math.hypot(origin.right - target.right, origin.top - target.bottom);
        return Math.min(d1, d2);
      case "down":
        d1 = Math.hypot(origin.left - target.left, target.top - origin.bottom);
        d2 = Math.hypot(origin.right - target.right, target.top - origin.bottom);
        return Math.min(d1, d2);
      case "left":
        d1 = Math.hypot(origin.right - target.left, origin.top - target.top);
        d2 = Math.hypot(origin.right - target.left, origin.bottom - target.bottom);
        return Math.min(d1, d2);
      case "right":
        d1 = Math.hypot(target.left - target.right, origin.top - target.top);
        d2 = Math.hypot(target.left - target.right, origin.bottom - target.bottom);
        return Math.min(d1, d2);
    }
    return 0;
  };

  const doGetNextElement = (origin: HTMLElement, direction: Direction2D) => {
    const originData = getDomData(origin);

    let next: HTMLElement | null = null;
    let minDistance = Infinity;
    let axisMinDistance = Infinity;

    for (const target of Array.from(parent.children)) {
      if (target === origin || !(target instanceof HTMLElement)) continue;

      const targetData = getDomData(target);
      if (!isValidPosition(originData, targetData, direction)) continue;

      const axisDistance = getAxisDistance(originData, targetData, direction);
      if (axisDistance > 0 && axisDistance <= axisMinDistance) {
        if (axisDistance < axisMinDistance) {
          axisMinDistance = axisDistance;
          minDistance = Infinity;
        }
        const distance = getDistance(originData, targetData, direction);
        if (distance > 0 && distance < minDistance) {
          next = target;
          minDistance = distance;
        }
      }
    }

    return next;
  };

  let result = doGetNextElement(element, direction);
  if (result != null) {
    return result;
  }

  const opposite =
    direction === "up"
      ? "down"
      : direction === "down"
      ? "up"
      : direction === "left"
      ? "right"
      : "left";

  result = doGetNextElement(element, opposite);
  while (result != null) {
    const next = doGetNextElement(result, opposite);
    if (next == null) {
      return result;
    }
    result = next;
  }
  return null;
}
