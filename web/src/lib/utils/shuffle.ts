/**
 * Given an array, return a new array with the same items in random order.
 *
 * @example
 * shuffle([1, 2, 3])
 * // [2, 3, 1]
 */
export const shuffle = <T>(items: readonly T[]): T[] =>
  items
    .map((item) => ({ item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ item }) => item);
