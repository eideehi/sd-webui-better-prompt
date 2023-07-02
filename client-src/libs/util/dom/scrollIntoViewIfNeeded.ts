export function scrollIntoViewIfNeeded(element: HTMLElement, parent: HTMLElement): void {
  const { top: parentTop, bottom: parentBottom } = parent.getBoundingClientRect();
  const { top: elementTop, bottom: elementBottom } = element.getBoundingClientRect();

  if (elementBottom > parentBottom) {
    const scrollOffset = elementBottom - parentBottom + parent.scrollTop;
    parent.scrollTo({ top: scrollOffset });
  } else if (elementTop < parentTop) {
    const scrollOffset = elementTop - parentTop + parent.scrollTop;
    parent.scrollTo({ top: scrollOffset });
  }
}
