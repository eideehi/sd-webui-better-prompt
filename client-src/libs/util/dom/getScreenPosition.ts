/**
 * Gets the on-screen position of a given DOM element, taking into account the variation in position due to scrolling.
 *
 * @param element - The DOM element to get the on-screen position of.
 * @returns An object with the `top` and `left` properties, representing the element's position relative to the viewport.
 */
export function getScreenPosition(element: Element): {
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
