/**
 * Dispatches an event of the specified type on the specified element.
 *
 * @param element The element to dispatch the event on.
 * @param type The type of event to dispatch.
 */
export function dispatchEvent(element: HTMLElement, type: "input" | "change"): void {
  if (type === "input") {
    updateInput(element);
  } else {
    const event = new Event(type);
    Object.defineProperty(event, "target", { value: element });
    element.dispatchEvent(event);
  }
}
