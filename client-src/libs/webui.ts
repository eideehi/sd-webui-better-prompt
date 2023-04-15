/**
 * Formats a string with placeholders using the specified arguments.
 *
 * @example
 *   _("{0} has {1}", "John", "Apple") // John has Apple
 *   _("{1} is hiring {0}", "John", "Apple") // Apple is hiring John
 * @param text The format string with placeholders.
 * @param args The arguments to replace the placeholders with.
 * @returns The formatted string with the placeholders replaced by the arguments.
 */
export function _(text: string, ...args: any[]): string {
  const translation = getTranslation(text) || text;
  if (args.length === 0) {
    return translation;
  }
  return args.reduce((result, value, index) => {
    return result.replace(`{${index}}`, value);
  }, translation);
}

/**
 * If an option with the specified name exists and it is of string type, execute the callback. If the option with the specified name does not exist or the type of the option is not string, do nothing.
 *
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withStringOption(optionName: string, callback: (value: string) => void): void {
  const value = opts[optionName];
  if (typeof value === "string") {
    callback(value);
  }
}

/**
 * If an option with the specified name exists and it is of boolean type, execute the callback. If the option with the specified name does not exist or the type of the option is not boolean, do nothing.
 *
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withBooleanOption(optionName: string, callback: (value: boolean) => void): void {
  const value = opts[optionName];
  if (typeof value === "boolean") {
    callback(value);
  }
}

/**
 * If an option with the specified name exists and it is of number type, execute the callback. If the option with the specified name does not exist or the type of the option is not number, do nothing.
 *
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withNumberOption(optionName: string, callback: (value: number) => void): void {
  const value = opts[optionName];
  if (typeof value === "number") {
    callback(value);
  }
}

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

/**
 * Returns the name of the currently active tab.
 */
export function getCurrentTabName(): WebUiTab {
  const content = get_uiCurrentTabContent();
  if (content == null) {
    return "other";
  }
  const { id } = content;
  if (id.startsWith("tab_")) {
    const tabName = id.slice(4);
    switch (tabName) {
      case "txt2img":
      case "img2img":
        return tabName;
    }
  }
  return "other";
}
