/**
 * Generates a 32-bit hash code for a given string.
 *
 * @param str - The string to generate a hash code for.
 * @returns The hash code for the given string.
 */
export function generateHashCode(str: string): number {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}
