export function sortByIndexes<T>(array: T[], indexes: number[]): T[] {
  const result: T[] = [];

  for (const index of indexes) {
    result.push(array[index]);
  }

  return result;
}
