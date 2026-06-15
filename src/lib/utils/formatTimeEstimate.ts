/**
 * Formats a time estimate based on the number of steps in a form.
 * @param steps - The total number of form steps
 * @param minMinutesPerStep - The minimum estimated minutes per step (default: 1)
 * @param maxMinutesPerStep - The maximum estimated minutes per step (default: 2)
 * @returns A formatted time estimate range string (e.g., "About 5–10 minutes")
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
