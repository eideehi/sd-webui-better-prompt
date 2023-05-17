/**
 * A regular expression to match a trailing comma followed by optional whitespace.
 */
const TRAILING_COMMA_REGEX = /,(\s+)?$/g;

/**
 * A regular expression to match a leading comma preceded by optional whitespace.
 */
const LEADING_COMMA_REGEX = /^(\s+)?,/g;

export function concatPrompt(prompt1: string, prompt2: string): string {
  if (!prompt1 || TRAILING_COMMA_REGEX.test(prompt1) || LEADING_COMMA_REGEX.test(prompt2)) {
    return prompt1 + prompt2;
  }
  return `${prompt1}, ${prompt2}`;
}
