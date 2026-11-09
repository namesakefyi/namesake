import { FIELD_DEFS, type FieldName, type FormData } from "#constants/fields";
import type { BooleanFieldName, Condition, Data } from "./types";

/** True when the field holds one of `values`. */
export function is<K extends FieldName>(
  field: K,
  ...values: readonly NonNullable<FormData[K]>[]
): Condition {
  return withDeps(
    (data) => (values as readonly unknown[]).includes(data[field]),
    [field],
  );
}

/** True when the field is `true`. */
export function isTrue(field: BooleanFieldName): Condition {
  return withDeps((data) => data[field] === true, [field]);
}

/** True when the field is `false` (not merely unanswered). */
export function isFalse(field: BooleanFieldName): Condition {
  return withDeps((data) => data[field] === false, [field]);
}

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

/** Combines conditions so all must hold. Returns undefined for none. */
export function allOf(
  conditions: readonly (Condition | undefined)[],
): Condition | undefined {
  const present = conditions.filter(
    (condition): condition is Condition => condition !== undefined,
  );
  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  const combined: Condition = (data) =>
    present.every((condition) => condition(data));
  combined.deps = present.flatMap((condition) => condition.deps ?? []);
  return combined;
}

const FIELD_TYPES = new Map<string, string>(
  FIELD_DEFS.map((definition) => [definition.name, definition.type]),
);

const FIRST_OPTION = new Map<string, string>(
  FIELD_DEFS.flatMap((definition) =>
    "options" in definition
      ? [[definition.name, Object.keys(definition.options)[0]]]
      : [],
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
        return FIRST_OPTION.get(fieldName) ?? "1990-01-01";
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
