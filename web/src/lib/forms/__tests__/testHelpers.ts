import { block, field, type StepNode } from "../steps";
import type { Condition, Step, TextFieldName } from "../types";

type TestField =
  | string
  | { id: string; when: Condition }
  | { ids: readonly string[]; when: Condition };

/** A labeled text field for a test step, named after its field. */
function textField(id: string, when?: Condition) {
  return field.shortText(id as TextFieldName, { label: id, when });
}

/**
 * Builds a step whose body asks each field as a short text question.
 * `{ id, when }` makes one field conditional; `{ ids, when }` groups
 * several under one condition.
 */
export function makeStep(
  id: string,
  fields: readonly TestField[] = [],
  when?: Condition,
): Step {
  const body: StepNode[] = fields.map((entry) => {
    if (typeof entry === "string") return textField(entry);
    if ("id" in entry) return textField(entry.id, entry.when);
    return block.subsection(
      entry.ids.map((fieldId) => textField(fieldId)),
      {
        when: entry.when,
      },
    );
  });
  return { id, title: `Step ${id}`, body, ...(when && { when }) };
}
