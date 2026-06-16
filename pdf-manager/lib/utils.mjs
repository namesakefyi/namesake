/** Returns the key as a valid JS property (quoted if needed). */
export function escapeKey(key) {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) return key;
  return JSON.stringify(key);
}
