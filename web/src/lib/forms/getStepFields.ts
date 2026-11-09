import type { FieldName } from "#constants/fields";
import { combineConditions } from "./conditions";
import type { Condition, OptionLabels, Step, Text } from "./types";
import { getRootContext, usesTitleAsLabel, walkNodes } from "./walkNodes";

/** One field a step writes, as every reader sees it. */
export interface StepField {
  id: FieldName;
  /** Step, enclosing subsection and node conditions combined. */
  when?: Condition;
  options?: OptionLabels;
  /** Shown as US dollars in the review table. */
  currency?: boolean;
  reviewLabel: Text;
}

function collectStepFields(step: Step): StepField[] {
  const fields: StepField[] = [];
  const unlabeledTitles = new Set<Text>();

  walkNodes(step.body, getRootContext(step), (node, context) => {
    const enclosing = context.conditions;

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
          when: combineConditions([
            step.when,
            ...enclosing,
            node.when,
            written.when,
          ]),
          options: written.options,
          currency: node.kind === "field.number" && !!node.props.currency,
          reviewLabel: written.reviewLabel ?? node.reviewLabel ?? label,
        });
      }
    }
  });

  return fields;
}

const cache = new WeakMap<Step, readonly StepField[]>();

/**
 * Every field a step writes, in the order they are asked, with what
 * visibility, review and persistence need to know. Cached per step object.
 */
export function getStepFields(step: Step): readonly StepField[] {
  let fields = cache.get(step);
  if (!fields) {
    fields = collectStepFields(step);
    cache.set(step, fields);
  }
  return fields;
}
