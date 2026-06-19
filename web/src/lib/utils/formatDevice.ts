import type { IDevice } from "ua-parser-js";

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
