import type { FieldName } from "#constants/fields";
import type { Step } from "#constants/forms";
import type { Condition, OptionLabels, Text } from "./questions";
import {
  getRootContext,
  usesTitleAsLabel,
  walkQuestions,
} from "./walkQuestions";

export interface StepField {
  id: FieldName;
  /** The step's, enclosing subsections' and the field's own conditions. */
  when?: Condition;
  options?: OptionLabels;
  currency?: boolean;
  /** Left off the review page while it has no answer. */
  optional: boolean;
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

  walkQuestions(step.questions, getRootContext(step), (question, context) => {
    if (question.type === "field") {
      if (usesTitleAsLabel(question)) {
        if (unlabeledTitles.has(context.title)) {
          throw new Error(
            `Step "${step.id}" has more than one unlabeled field under the same title. Only the single question of a step or titled subsection may omit its label.`,
          );
        }
        unlabeledTitles.add(context.title);
      }
      const label = question.label ?? context.title;
      for (const written of question.writes) {
        fields.push({
          id: written.id,
          when: allOf([
            step.when,
            ...context.conditions,
            question.when,
            written.when,
          ]),
          options: written.options,
          optional: !!written.optional,
          currency: question.kind === "number" && !!question.props.currency,
          reviewLabel: written.reviewLabel ?? question.reviewLabel ?? label,
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
