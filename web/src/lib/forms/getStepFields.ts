import type { FieldName } from "#constants/fields";
import type { Condition, OptionLabels, Step, Text } from "./types";
import { getRootContext, usesTitleAsLabel, walkNodes } from "./walkNodes";

export interface StepField {
  id: FieldName;
  /** The step's, enclosing subsections' and the field's own conditions. */
  when?: Condition;
  options?: OptionLabels;
  currency?: boolean;
  reviewLabel: Text;
}

function allOf(conditions: (Condition | undefined)[]): Condition | undefined {
  const present = conditions.filter((condition) => condition !== undefined);
  if (present.length <= 1) return present[0];
  return (data) => present.every((condition) => condition(data));
}

function collectStepFields(step: Step): StepField[] {
  const fields: StepField[] = [];
  const unlabeledTitles = new Set<Text>();

  walkNodes(step.body, getRootContext(step), (node, context) => {
    if (node.type === "field") {
      if (usesTitleAsLabel(node)) {
        if (unlabeledTitles.has(context.title)) {
          throw new Error(
            `Step "${step.id}" has more than one unlabeled field under the same title. Only the single question of a step or titled subsection may omit its label.`,
          );
        }
        unlabeledTitles.add(context.title);
      }
      const label = node.label ?? context.title;
      for (const written of node.writes) {
        fields.push({
          id: written.id,
          when: allOf([
            step.when,
            ...context.conditions,
            node.when,
            written.when,
          ]),
          options: written.options,
          currency: node.kind === "number" && !!node.props.currency,
          reviewLabel: written.reviewLabel ?? node.reviewLabel ?? label,
        });
      }
    }
  });

  return fields;
}

const cache = new WeakMap<Step, readonly StepField[]>();

/** Every field a step writes, in the order they are asked. */
export function getStepFields(step: Step): readonly StepField[] {
  let fields = cache.get(step);
  if (!fields) {
    fields = collectStepFields(step);
    cache.set(step, fields);
  }
  return fields;
}
