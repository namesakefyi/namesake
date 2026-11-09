/**
 * Label props for an input whose label may be visually hidden: a hidden
 * label becomes the accessible name instead of a visible `<Label>`.
 */
export function getLabelProps(
  label: string,
  labelHidden?: boolean,
): { label?: string; "aria-label"?: string } {
  return labelHidden ? { "aria-label": label } : { label };
}
