import { FIELD_DEFS, type FieldName } from "#constants/fields";
import { getFieldLabel } from "#lib/utils/formatReviewFields";
import { resolveText } from "../resolveStepContent";
import type { Field, Step } from "../types";
import { allOf, traceReads } from "./conditions";
import type {
  AnyFieldNode,
  Condition,
  OptionLabels,
  StepNode,
  SubsectionNode,
  Text,
} from "./types";

/** One field a step writes, as every reader sees it. */
export interface ModelField {
  id: FieldName;
  /** Step, enclosing subsection and node conditions combined. */
  when?: Condition;
  options?: OptionLabels;
  /** Shown as US dollars in the review table. */
  currency?: boolean;
  reviewLabel: Text;
}

/** What every reader needs to know about a step. */
export interface StepModel {
  /** One entry per field written, in the order they are asked. */
  fields: readonly ModelField[];
  /** Fields read by every condition and `block.display` node. */
  reads: readonly FieldName[];
  /** The node tree, or null for a legacy step. */
  body: readonly StepNode[] | null;
  /** How many `render` overrides and `block.custom` nodes the body uses. */
  fallbacks: number;
}

/**
 * Whether a field node takes its container's title as a hidden label: the
 * single question of a step or titled subsection. Composite nodes (no
 * single `name`) label each of their own inputs.
 */
export function usesTitleAsLabel(node: AnyFieldNode): boolean {
  return node.label === undefined && node.name !== undefined;
}

/** Where a node sits: its enclosing conditions and nearest title. */
export interface NodeContext {
  conditions: readonly Condition[];
  /** The nearest titled subsection's title, or the step title. */
  title: Text;
}

/** The context a step's top-level nodes sit in. */
export function getRootContext(step: Step): NodeContext {
  return { conditions: [], title: step.title };
}

/** The context a subsection's children sit in. */
export function getChildContext(
  node: SubsectionNode,
  context: NodeContext,
): NodeContext {
  const { title } = node;
  return {
    conditions: node.when
      ? [...context.conditions, node.when]
      : context.conditions,
    title:
      typeof title === "function"
        ? (data) => title(data) ?? resolveText(context.title, data)
        : (title ?? context.title),
  };
}

/** Calls `visit` for every node in order, with where it sits. */
export function walkNodes(
  nodes: readonly StepNode[],
  context: NodeContext,
  visit: (node: StepNode, context: NodeContext) => void,
): void {
  for (const node of nodes) {
    visit(node, context);
    if (node.kind === "block.subsection") {
      walkNodes(node.children, getChildContext(node, context), visit);
    }
  }
}

type LegacyEntry = { id: FieldName; when?: Condition };

/** Expands a legacy `fields` list into one entry per field. */
export function expandLegacyFields(fields: readonly Field[]): LegacyEntry[] {
  const result: LegacyEntry[] = [];
  for (const entry of fields) {
    if (typeof entry === "string") {
      result.push({ id: entry });
    } else if ("id" in entry) {
      result.push({ id: entry.id, when: entry.when });
    } else {
      for (const id of entry.ids) {
        result.push({ id, when: entry.when });
      }
    }
  }
  return result;
}

const LEGACY_OPTIONS = new Map<FieldName, OptionLabels>(
  FIELD_DEFS.flatMap((definition) =>
    "options" in definition ? [[definition.name, definition.options]] : [],
  ),
);

function normalizeLegacy(step: Step & { fields: readonly Field[] }) {
  const entries = expandLegacyFields(step.fields);
  const fields = entries.map(
    ({ id, when }): ModelField => ({
      id,
      when: allOf([step.when, when]),
      options: LEGACY_OPTIONS.get(id),
      reviewLabel: getFieldLabel(id),
    }),
  );
  const conditions = [step.when, ...entries.map(({ when }) => when)];
  return { fields, conditions, displayReads: [], fallbacks: 0 };
}

function normalizeBody(step: Step & { body: readonly StepNode[] }) {
  const fields: ModelField[] = [];
  const conditions: (Condition | undefined)[] = [step.when];
  const displayReads: FieldName[] = [];
  let fallbacks = 0;
  const unlabeledTitles = new Set<Text>();

  walkNodes(
    step.body,
    { conditions: [], title: step.title },
    (node, context) => {
      const enclosing = context.conditions;
      if ("when" in node) conditions.push(node.when);

      if (node.type === "field") {
        if (node.render) fallbacks++;
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
          conditions.push(written.when);
          fields.push({
            id: written.id,
            when: allOf([step.when, ...enclosing, node.when, written.when]),
            options: written.options,
            currency: node.kind === "field.number" && !!node.props.currency,
            reviewLabel: written.reviewLabel ?? node.reviewLabel ?? label,
          });
        }
        return;
      }

      switch (node.kind) {
        case "block.custom":
          fallbacks++;
          for (const id of node.writes) {
            fields.push({
              id,
              when: allOf([step.when, ...enclosing]),
              // Custom nodes carry no labels; FIELD_DEFS supplies them until
              // its labels are removed.
              reviewLabel: getFieldLabel(id),
            });
          }
          break;
        case "block.display":
          displayReads.push(...node.reads);
          break;
      }
    },
  );

  return { fields, conditions, displayReads, fallbacks };
}

const cache = new WeakMap<Step, StepModel>();

/**
 * Produces the model every reader consumes, from either a `body` or a
 * legacy `fields` list. Cached per step object.
 */
export function normalizeStep(step: Step): StepModel {
  const cached = cache.get(step);
  if (cached) return cached;

  const { fields, conditions, displayReads, fallbacks } = step.body
    ? normalizeBody(step)
    : normalizeLegacy(step);

  let reads: FieldName[] | undefined;

  const model: StepModel = {
    fields,
    // Traced on first use, since only integrity checks need it.
    get reads() {
      if (!reads) {
        const found = new Set<FieldName>(displayReads);
        for (const condition of conditions) {
          if (!condition) continue;
          for (const id of traceReads(condition)) found.add(id);
        }
        reads = [...found];
      }
      return reads;
    },
    body: step.body ?? null,
    fallbacks,
  };
  cache.set(step, model);
  return model;
}
