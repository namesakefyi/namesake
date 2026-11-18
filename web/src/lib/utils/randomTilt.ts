const MAX_TILT_DEGREES = 3;

/**
 * Return a random CSS rotation between -maxDegrees and maxDegrees.
 *
 * @example
 * randomTilt()
 * // "-1.27deg"
 */
export const randomTilt = (maxDegrees = MAX_TILT_DEGREES) =>
  `${((Math.random() * 2 - 1) * maxDegrees).toFixed(2)}deg`;
