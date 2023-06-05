export function toggleValue<T>(array: T[], value: T): T[] {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
  return array;
}
