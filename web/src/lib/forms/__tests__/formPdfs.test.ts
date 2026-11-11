import { describe, expect, it } from "vitest";
import type { FieldTypeName } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { PDFFieldValue, PdfFieldType } from "#constants/pdf";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import { resolveFormVisibility } from "../formVisibility";
import { getStepFields } from "../getStepFields";
import type { Data, FieldValue } from "../questions";
import { forms } from "./formFixtures";

const SAMPLE_TEXT: Partial<Record<FieldTypeName, readonly [string, string]>> = {
  date: ["1990-06-15", "2015-02-28"],
  number: ["1200", "0"],
  phone: ["+1 (234) 567-8901", "+1 (555) 010-0000"],
  email: ["alex@example.com", "sam@example.org"],
  state: ["MA", "NY"],
  country: ["US", "CA"],
  language: ["es", "fr"],
};

/** Two answer sets: yes to everything, then no to everything. */
function sampleAnswers(config: FormConfig, variant: 0 | 1): Data {
  const data: Record<string, FieldValue> = {};
  for (const step of config.steps) {
    for (const { id, type, options } of getStepFields(step)) {
      const keys = Object.keys(options ?? {});
      if (type === "bool") data[id] = variant === 0;
      else if (type === "list") data[id] = variant === 0 ? keys : [];
      else if (type === "oneOf")
        data[id] = keys.at(variant === 0 ? 0 : -1) ?? "";
      else data[id] = SAMPLE_TEXT[type]?.[variant] ?? `${id} ${variant}`;
    }
  }
  return data;
}

const fitsField: Record<PdfFieldType, (value: PDFFieldValue) => boolean> = {
  text: (value) => value == null || typeof value === "string",
  checkbox: (value) => value == null || typeof value === "boolean",
  radio: (value) =>
    value == null || typeof value === "string" || typeof value === "boolean",
  button: (value) => value == null,
};

const pairs = forms.flatMap(([formId, config]) =>
  config.download.pdfs.map((entry) => ({
    name: `${formId} › ${entry.pdf.code ?? entry.pdf.title}`,
    config,
    entry,
  })),
);

describe.each(pairs)("$name", ({ config, entry: { pdf, fill } }) => {
  const fills = ([0, 1] as const).map((variant) =>
    fill(
      resolveFormVisibility(config.steps, sampleAnswers(config, variant))
        .visibleFields,
    ),
  );

  it("fills every field of the PDF, and no others", () => {
    for (const values of fills) {
      expect(Object.keys(values).sort()).toEqual(
        Object.keys(pdf.fields).sort(),
      );
    }
  });

  it("gives each field a value of its kind", () => {
    const failures = fills.flatMap((values) =>
      Object.entries(pdf.fields)
        .filter(([name, kind]) => !fitsField[kind](values[name]))
        .map(
          ([name, kind]) =>
            `${name} (${kind}): ${JSON.stringify(values[name])}`,
        ),
    );
    expect(failures).toEqual([]);
  });

  it("writes its values into the PDF", async () => {
    await expectPdfFieldsMatch(pdf, fills[0]);
  });
});
