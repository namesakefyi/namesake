import type { OptionLabel, OptionLabels } from "./types";

export interface Choice {
  value: string;
  label: string;
  description?: string;
}

/** The text of an option's label. */
export function getOptionLabel(option: OptionLabel): string {
  return typeof option === "string" ? option : option.label;
}

const choicesCache = new WeakMap<OptionLabels, readonly Choice[]>();

/**
 * Turns option labels into the `{ value, label, description }` list field
 * components take. Cached per options object, since nodes never change.
 */
export function toChoices(options: OptionLabels): readonly Choice[] {
  let choices = choicesCache.get(options);
  if (!choices) {
    choices = Object.entries(options).map(([value, option]) =>
      typeof option === "string"
        ? { value, label: option }
        : { value, label: option.label, description: option.description },
    );
    choicesCache.set(options, choices);
  }
  return choices;
}
