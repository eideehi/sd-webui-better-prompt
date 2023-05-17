/**
 * If the specified option name exists and it is of boolean type, execute the callback. If the specified option name does not exist or the option type is not boolean, do nothing.
 *
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withBooleanOption(optionName: string, callback: Callback1<boolean>): void {
  const value = opts[optionName];
  if (typeof value === "boolean") {
    callback(value);
  }
}
