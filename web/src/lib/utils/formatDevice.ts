import type { IDevice } from "ua-parser-js";

/**
 * Given a device from `UAParser()`, return the device name
 * or "this device" if unknown.
 *
 * Use with `UAParser(navigator.userAgent).device` from "ua-parser-js".
 *
 * @example
 * formatDevice({ type: "mobile", vendor: "Apple", model: "iPhone" })
 * // "this Apple iPhone"
 * formatDevice(null)
 * // "this device"
 */
export function formatDevice(device: Partial<IDevice> | null) {
  let deviceName = "device";

  if (device?.vendor) {
    if (device.model) {
      deviceName = `${device.vendor} ${device.model}`;
    } else {
      deviceName = device.vendor;
    }
  }

  return `this ${deviceName}`;
}
