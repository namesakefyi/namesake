import { FIELD_DEFS, type FieldName } from "#constants/fields";
import { getFieldLabel } from "#lib/utils/formatReviewFields";
import type { Field, Step } from "../types";
import { allOf, traceReads } from "./conditions";
import type {
  AnyFieldNode,
  Condition,
  OptionLabels,
  StepNode,
  Text,
} from "./types";

/** One field a step writes, as every reader sees it. */
export interface ModelField {
  id: FieldName;
  /** Step, enclosing subsection and node conditions combined. */
  when?: Condition;
  options?: OptionLabels;
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
 * Whether a field node takes the step title as its hidden label. Composite
 * nodes (no single `name`) label each of their own inputs.
 */
export function usesStepTitleAsLabel(node: AnyFieldNode): boolean {
  return node.label === undefined && node.name !== undefined;
}

/** The label shown on a field node's input, before resolving any function. */
export function getNodeLabel(node: AnyFieldNode, step: Step): Text {
  return node.label ?? step.title;
}

/** Calls `visit` for every node in order, with its enclosing conditions. */
export function walkNodes(
  nodes: readonly StepNode[],
  visit: (node: StepNode, enclosing: readonly Condition[]) => void,
  enclosing: readonly Condition[] = [],
): void {
  for (const node of nodes) {
    visit(node, enclosing);
    if (node.kind === "block.subsection") {
      walkNodes(
        node.children,
        visit,
        node.when ? [...enclosing, node.when] : enclosing,
      );
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
  const unlabeled: string[] = [];

  walkNodes(step.body, (node, enclosing) => {
    if ("when" in node) conditions.push(node.when);

    if (node.type === "field") {
      if (node.render) fallbacks++;
      if (usesStepTitleAsLabel(node)) unlabeled.push(node.kind);
      const label = getNodeLabel(node, step);
      for (const written of node.writes) {
        conditions.push(written.when);
        fields.push({
          id: written.id,
          when: allOf([step.when, ...enclosing, node.when, written.when]),
          options: written.options,
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
  });

  if (unlabeled.length > 1) {
    throw new Error(
      `Step "${step.id}" has ${unlabeled.length} unlabeled fields (${unlabeled.join(", ")}). Only a step's single question may omit its label.`,
    );
  }

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
