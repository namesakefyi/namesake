import { describe, expect, it } from "vitest";
import type { FieldName } from "#constants/fields";
import type { FormConfig } from "#constants/forms";
import type { PDFDefinition } from "#constants/pdf";
import { traceReads } from "../conditions";
import { getFormConfigs } from "../getFormConfig";
import { getStepFields } from "../getStepFields";
import type { Condition, Step } from "../types";
import { getRootContext, walkNodes } from "../walkNodes";

/*
 * Integrity checks over every form's data. Each check reads the steps'
 * fields and node trees; resolvers and conditions are inspected by calling
 * them with recording proxies, never by parsing source.
 */

const forms = Object.entries(getFormConfigs());

const pdfDefinitions = new Map(
  Object.values(
    import.meta.glob<{ default: PDFDefinition }>(
      "/src/content/pdfs/**/index.ts",
      { eager: true },
    ),
  ).map((module) => [module.default.id, module.default]),
);

/**
 * Check 1 allowlist: PDF fields no step asks for, keyed by form slug.
 * Each entry says why the PDF can do without the answer.
 */
const UNASKED_PDF_FIELDS: Record<string, Partial<Record<FieldName, string>>> = {
  "court-order-ma-minor": {
    mothersMaidenName:
      "No step asks this yet; the CJP 34 line is left blank for the filer to complete",
    otherNamesOrAliases:
      "No step asks this yet; the CJP 34 line is left blank for the filer to complete",
  },
  "court-order-ri": {
    previousNameFrom:
      "The previous-name step only asks yes/no; the filer completes this line",
  },
};

/**
 * Check 3 allowlist: conditions that read a field not written earlier,
 * keyed by `<form slug> › <step id>`.
 */
const CONDITION_ORDER_EXCEPTIONS: Record<
  string,
  Partial<Record<FieldName, string>>
> = {};

/** Check 4 allowlist: fields more than one step writes, keyed by form slug. */
const SHARED_WRITERS: Record<string, Partial<Record<FieldName, string>>> = {};

function getWrittenFields(config: FormConfig): Set<FieldName> {
  return new Set(
    config.steps.flatMap((step) =>
      getStepFields(step).map((field) => field.id),
    ),
  );
}

function getIncludedPdfs(config: FormConfig): PDFDefinition[] {
  return config.pdfs.map(({ pdfId }) => {
    const definition = pdfDefinitions.get(pdfId);
    if (!definition) throw new Error(`No PDF definition for ${pdfId}`);
    return definition;
  });
}

/** Fields read by a step's conditions and `block.display` nodes. */
function getStepReads(step: Step): Set<FieldName> {
  const reads = new Set<FieldName>();
  const trace = (condition: Condition | undefined) => {
    if (!condition) return;
    for (const field of traceReads(condition)) reads.add(field);
  };
  trace(step.when);
  walkNodes(step.body, getRootContext(step), (node) => {
    if ("when" in node) trace(node.when);
    if (node.type === "field") {
      for (const written of node.writes) trace(written.when);
    } else if (node.kind === "block.display") {
      for (const field of node.reads) reads.add(field);
    }
  });
  return reads;
}

/** Removes allowlisted findings and lists allowlist entries that went unused. */
function applyAllowlist(
  findings: readonly { key: string; field: FieldName; message: string }[],
  allowlist: Record<string, Partial<Record<FieldName, string>>>,
  keys: readonly string[],
) {
  const used = new Set<string>();
  const failures = findings
    .filter(({ key, field }) => {
      if (allowlist[key]?.[field] === undefined) return true;
      used.add(`${key}:${field}`);
      return false;
    })
    .map(({ message }) => message);
  const stale = keys.flatMap((key) =>
    Object.keys(allowlist[key] ?? {})
      .filter((field) => !used.has(`${key}:${field}`))
      .map((field) => `${key}: ${field} is allowlisted but no longer needed`),
  );
  return { failures, stale };
}

describe("form integrity", () => {
  it("1. every field an included PDF reads is written by some step", () => {
    const findings = forms.flatMap(([slug, config]) => {
      const written = getWrittenFields(config);
      return getIncludedPdfs(config).flatMap((pdf) =>
        traceReads(pdf.resolver)
          .filter((field) => !written.has(field))
          .map((field) => ({
            key: slug,
            field,
            message: `${slug}: ${pdf.id} reads ${field}, which no step asks for`,
          })),
      );
    });
    const { failures, stale } = applyAllowlist(
      findings,
      UNASKED_PDF_FIELDS,
      forms.map(([slug]) => slug),
    );
    expect(failures).toEqual([]);
    expect(stale).toEqual([]);
  });

  it("2. reports written fields that nothing reads", () => {
    const report = forms.flatMap(([slug, config]) => {
      const read = new Set<FieldName>();
      for (const pdf of getIncludedPdfs(config)) {
        for (const field of traceReads(pdf.resolver)) read.add(field);
      }
      for (const pdfConfig of config.pdfs) {
        if (pdfConfig.when) {
          for (const field of traceReads(pdfConfig.when)) read.add(field);
        }
      }
      for (const instruction of config.instructions) {
        if (typeof instruction === "string") continue;
        for (const field of traceReads(instruction.when)) read.add(field);
      }
      for (const step of config.steps) {
        for (const field of getStepReads(step)) read.add(field);
        for (const text of [step.title, step.description]) {
          if (typeof text !== "function") continue;
          for (const field of traceReads(text)) read.add(field);
        }
      }
      const unread = [...getWrittenFields(config)].filter(
        (field) => !read.has(field),
      );
      return unread.length > 0 ? [`${slug}: unread: ${unread.join(", ")}`] : [];
    });
    if (report.length > 0) {
      console.info(`Form integrity report:\n${report.join("\n")}`);
    }
  });

  it("3. conditions only read fields written earlier", () => {
    const findings: { key: string; field: FieldName; message: string }[] = [];

    for (const [slug, config] of forms) {
      const known = new Set<FieldName>();

      for (const step of config.steps) {
        const key = `${slug} › ${step.id}`;
        const check = (condition: Condition | undefined, owner: string) => {
          if (!condition) return;
          for (const field of traceReads(condition)) {
            if (known.has(field)) continue;
            findings.push({
              key,
              field,
              message: `${key}: the condition on ${owner} reads ${field}, which isn't written earlier`,
            });
          }
        };

        // Fields this step writes become known as the walk reaches them.
        check(step.when, "the step");
        walkNodes(step.body, getRootContext(step), (node) => {
          if ("when" in node) check(node.when, node.kind);
          if (node.type === "field") {
            for (const entry of node.writes) {
              check(entry.when, entry.id);
              known.add(entry.id);
            }
          }
        });
      }
    }

    const { failures, stale } = applyAllowlist(
      findings,
      CONDITION_ORDER_EXCEPTIONS,
      Object.keys(CONDITION_ORDER_EXCEPTIONS),
    );
    expect(failures).toEqual([]);
    expect(stale).toEqual([]);
  });

  it("4. one step writes each field per form", () => {
    const findings = forms.flatMap(([slug, config]) => {
      const writers = new Map<FieldName, string[]>();
      for (const step of config.steps) {
        for (const { id } of getStepFields(step)) {
          writers.set(id, [...(writers.get(id) ?? []), step.id]);
        }
      }
      return [...writers]
        .filter(([, stepIds]) => stepIds.length > 1)
        .map(([field, stepIds]) => ({
          key: slug,
          field,
          message: `${slug}: ${field} is written by ${stepIds.join(", ")}`,
        }));
    });
    const { failures, stale } = applyAllowlist(
      findings,
      SHARED_WRITERS,
      forms.map(([slug]) => slug),
    );
    expect(failures).toEqual([]);
    expect(stale).toEqual([]);
  });
});
