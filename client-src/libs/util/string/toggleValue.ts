/**
 * Toggles the presence of a keyword in a string of concatenated values separated by '|'.
 * If the keyword is present and force is not set to true, it is removed;
 * otherwise, it is added. If the keyword is not present and force is not set to false,
 * it is added; otherwise, it is removed.
 *
 * @param values - The string of concatenated values.
 * @param keyword - The string to add/remove.
 * @param force - An optional boolean indicating whether to force the addition or removal of the keyword.
 * If set to true, the keyword will always be added, even if it is already present in values.
 * If set to false, the keyword will always be removed, even if it is not present in values.
 * @returns The new string of concatenated values.
 */
export function toggleValue(values: string, keyword: string, force?: boolean): string {
  const valueSet = new Set(values.split("|"));
  const hasKeyword = valueSet.has(keyword);
  if (hasKeyword && (force == null || !force)) {
    valueSet.delete(keyword);
  } else if (!hasKeyword && (force == null || force)) {
    valueSet.add(keyword);
  }
  return Array.from(valueSet)
    .filter((str) => str.length > 0)
    .join("|");
}
