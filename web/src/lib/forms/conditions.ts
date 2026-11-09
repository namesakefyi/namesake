import { FIELD_DEFS, type FieldName } from "#constants/fields";
import type { Condition, Data } from "./types";

/**
 * Declares fields a predicate reads that tracing can miss, such as a field
 * read only after `&&` or `||` short-circuits.
 */
export function withDeps(
  predicate: (data: Data) => boolean,
  deps: readonly FieldName[],
): Condition {
  const condition: Condition = (data) => predicate(data);
  condition.deps = deps;
  return condition;
}

/**
 * Combines the conditions that are present so all must hold, or returns
 * undefined when there are none.
 */
export function combineConditions(
  conditions: readonly (Condition | undefined)[],
): Condition | undefined {
  const present = conditions.filter(
    (condition): condition is Condition => condition !== undefined,
  );
  if (present.length <= 1) return present[0];
  return withDeps(
    (data) => present.every((condition) => condition(data)),
    present.flatMap((condition) => condition.deps ?? []),
  );
}

const FIELD_TYPES = new Map<string, string>(
  FIELD_DEFS.map((definition) => [definition.name, definition.type]),
);

const FIRST_VALUE = new Map<string, string>(
  FIELD_DEFS.flatMap((definition) =>
    "values" in definition ? [[definition.name, definition.values[0]]] : [],
  ),
);

type Sample = (fieldName: string) => unknown;

/** Answer sets tracing runs through, to reach more branches. */
const SAMPLES: readonly Sample[] = [
  () => undefined,
  (fieldName) => {
    switch (FIELD_TYPES.get(fieldName)) {
      case "boolean":
        return true;
      case "string[]":
        return ["other"];
      default:
        return FIRST_VALUE.get(fieldName) ?? "1990-01-01";
    }
  },
  (fieldName) => {
    switch (FIELD_TYPES.get(fieldName)) {
      case "boolean":
        return false;
      case "string[]":
        return [];
      default:
        return "";
    }
  },
];

/**
 * Lists the fields a function reads by calling it with recording proxies
 * over several sample answer sets. Errors thrown by the function are
 * ignored; reads made before the error still count.
 */
export function traceReads(
  read: ((data: Data) => unknown) & { deps?: readonly FieldName[] },
): FieldName[] {
  const fields = new Set<FieldName>(read.deps ?? []);
  for (const sample of SAMPLES) {
    const data = new Proxy({} as Data, {
      get(_target, property) {
        if (typeof property !== "string" || !FIELD_TYPES.has(property)) {
          return undefined;
        }
        fields.add(property as FieldName);
        return sample(property);
      },
      has(_target, property) {
        if (typeof property === "string" && FIELD_TYPES.has(property)) {
          fields.add(property as FieldName);
        }
        return false;
      },
    });
    try {
      read(data);
    } catch {
      // Reads made before the error are still recorded.
    }
  }
  return [...fields];
}
