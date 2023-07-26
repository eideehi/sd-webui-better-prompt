export type MessageArgValue = string | number | boolean;
export type MessageArg = MessageArgValue | (() => MessageArgValue);

/**
 * Represents a translatable message.
 */
export interface Message {
  /**
   * Translates the message with optional arguments.
   * @param args The arguments to be replaced in the message.
   * @returns The translated message.
   */
  (...args: MessageArg[]): string;
}

interface MessageConstructor {
  (key: string, defaultValue: string): Message;
}

/**
 * Creates a new translatable message.
 * @param key The unique key of the message.
 * @param defaultValue The default value of the message.
 * @returns The created Message object.
 */
export const Message: MessageConstructor = (key: string, defaultValue: string): Message => {
  let translation: Nullable<string> = null;
  return (...args: MessageArg[]): string => {
    if (translation == null) {
      translation = getTranslation(key) || defaultValue;
    }

    if (args.length === 0) return translation;
    return args.reduce<string>((result, value, index) => {
      const arg = typeof value === "function" ? value() : value;
      return result.replaceAll(`{${index}}`, String(arg));
    }, translation);
  };
};
