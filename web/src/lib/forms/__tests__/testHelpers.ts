import type { TextFieldName } from "#constants/fields";
import type { Step } from "#constants/forms";
import { type Condition, type Question, q } from "#lib/forms/questions";

type TestField =
  | string
  | { id: string; when: Condition }
  | { ids: readonly string[]; when: Condition };

function textField(id: string, when?: Condition) {
  return q.shortText(id as TextFieldName, {
    when,
    label: id,
  });
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
  const questions: Question[] = fields.map((entry) => {
    if (typeof entry === "string") return textField(entry);
    if ("id" in entry) return textField(entry.id, entry.when);
    return q.subsection(
      entry.ids.map((fieldId) => textField(fieldId)),
      { when: entry.when },
    );
  });
  return { id, title: `Step ${id}`, questions, ...(when && { when }) };
}
