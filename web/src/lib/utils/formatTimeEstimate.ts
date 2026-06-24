/**
 * Given the number of steps in a form, return a formatted time estimate range.
 *
 * @example
 * formatTimeEstimate(10)
 * // "3–8 minutes"
 */
export function formatTimeEstimate(
  steps: number,
  minMinutesPerStep = 0.3,
  maxMinutesPerStep = 0.75,
): string {
  const minMinutes = Math.ceil(steps * minMinutesPerStep);
  const maxMinutes = Math.ceil(steps * maxMinutesPerStep);

  // If min and max are the same, show single value
  if (minMinutes === maxMinutes) {
    return `${minMinutes} minute${minMinutes !== 1 ? "s" : ""}`;
  }

  // Otherwise show range with en dash
  return `${minMinutes}–${maxMinutes} minutes`;
}
