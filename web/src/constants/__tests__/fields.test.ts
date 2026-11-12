import { describe, expect, it } from "vitest";
import { ADDRESS_FIELDS, NAME_FIELDS } from "#constants/fieldGroups";
import {
  type FieldDefinition,
  getSharedFieldType,
  SHARED_FIELDS,
  type SharedFieldName,
} from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import {
  forms,
  getAskedFields,
  getFieldsReadBy,
} from "#lib/forms/__tests__/formFixtures";
import { getStepFields } from "#lib/forms/getStepFields";
import type { FormData, Text } from "#lib/forms/questions";
import { getRootContext, walkQuestions } from "#lib/forms/walkQuestions";

const BOOLEAN_PREFIX = /^(is|has|should|are|was|does|can)[A-Z0-9]/;

/** Every function in a form that reads answers. */
function getReaders(config: FormConfig): ((data: FormData) => unknown)[] {
  const readers: ((data: FormData) => unknown)[] = [];
  const add = (reader: Text | ((data: FormData) => unknown) | undefined) => {
    if (typeof reader === "function") readers.push(reader);
  };
  for (const step of config.steps) {
    add(step.when);
    add(step.title);
    add(step.description);
    walkQuestions(step.questions, getRootContext(step), (question) => {
      add(question.when);
      if (question.type === "field") {
        add(question.label);
        add(question.reviewLabel);
        for (const written of question.writes) {
          add(written.when);
          add(written.reviewLabel);
        }
      } else if (question.kind === "banner") {
        add(question.props.content);
      } else if (question.kind === "subsection") {
        add(question.props.title);
      }
    });
  }
  for (const pdf of config.download.pdfs) {
    add(pdf.when);
    add(pdf.fill);
  }
  for (const instruction of config.download.instructions) {
    if (typeof instruction !== "string") add(instruction.when);
  }
  return readers;
}

const GROUP_FIELD_NAMES = new Set<string>(
  [...Object.values(NAME_FIELDS), ...Object.values(ADDRESS_FIELDS)].flatMap(
    (parts) => Object.values(parts),
  ),
);

function getSharedFieldValues(name: string): readonly string[] {
  const field: (FieldDefinition & { values?: readonly string[] }) | undefined =
    Object.hasOwn(SHARED_FIELDS, name)
      ? SHARED_FIELDS[name as SharedFieldName]
      : undefined;
  return field?.values ?? [];
}

function getWrittenFields(config: FormConfig) {
  return config.steps.flatMap(getStepFields).map(({ id, type, options }) => ({
    id,
    type,
    options: Object.keys(options ?? {}),
  }));
}

describe("fields", () => {
  it("asks shared fields with their question type", () => {
    const failures = forms.flatMap(([formId, config]) =>
      getWrittenFields(config).flatMap(({ id, type }) => {
        const shared = getSharedFieldType(id);
        return shared && shared !== type
          ? [`${formId}: ${id} is asked as ${type}, but should be ${shared}`]
          : [];
      }),
    );
    expect(failures).toEqual([]);
  });

  it("labels every value of a shared field, and no others", () => {
    const failures = forms.flatMap(([formId, config]) =>
      getWrittenFields(config).flatMap(({ id, options }) => {
        const values = getSharedFieldValues(id);
        const matches =
          options.length === values.length &&
          values.every((value) => options.includes(value));
        return values.length > 0 && !matches
          ? [`${formId}: ${id} options must be ${values.join(", ")}`]
          : [];
      }),
    );
    expect(failures).toEqual([]);
  });

  it("shares only fields that two or more forms ask", () => {
    const failures = Object.keys(SHARED_FIELDS)
      .filter((name) => !GROUP_FIELD_NAMES.has(name))
      .flatMap((name) => {
        const askers = forms.filter(([, config]) =>
          getAskedFields(config).has(name),
        );
        return askers.length >= 2
          ? []
          : [`${name} is shared but asked by ${askers.length} form(s)`];
      });
    expect(failures).toEqual([]);
  });

  it("uses every answer a form asks for", () => {
    const failures = forms.flatMap(([formId, config]) => {
      const asked = getAskedFields(config);
      const read = new Set(
        getReaders(config).flatMap((reader) => getFieldsReadBy(reader, asked)),
      );
      return [...asked.keys()]
        .filter((name) => !read.has(name))
        .map((name) => `${formId}: ${name} is asked but never read`);
    });
    expect(failures).toEqual([]);
  });

  it("gives each form's own fields names no other form uses", () => {
    const owners = new Map<string, string[]>();
    for (const [formId, config] of forms) {
      for (const name of getAskedFields(config).keys()) {
        if (getSharedFieldType(name)) continue;
        owners.set(name, [...(owners.get(name) ?? []), formId]);
      }
    }
    const failures = [...owners]
      .filter(([, formIds]) => formIds.length > 1)
      .map(([name, formIds]) => `${name} is asked by ${formIds.join(", ")}`);
    expect(failures).toEqual([]);
  });

  it("names booleans as questions", () => {
    const booleans = new Set([
      ...Object.entries(SHARED_FIELDS)
        .filter(([, field]) => field.type === "bool")
        .map(([name]) => name),
      ...forms.flatMap(([, config]) =>
        [...getAskedFields(config)]
          .filter(([, type]) => type === "bool")
          .map(([name]) => name),
      ),
    ]);
    const failures = [...booleans].filter((name) => !BOOLEAN_PREFIX.test(name));
    expect(failures).toEqual([]);
  });
});
