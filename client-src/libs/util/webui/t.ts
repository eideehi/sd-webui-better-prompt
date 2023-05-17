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
export function t(text: string, ...args: Array<string | number | boolean>): string {
  const translation = getTranslation(text) || text;
  if (args.length === 0) {
    return translation;
  }
  return args.reduce<string>((result, value, index) => {
    return result.replace(`{${index}}`, String(value));
  }, translation);
}
