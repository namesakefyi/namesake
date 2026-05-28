import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument } from "@cantoo/pdf-lib";
import type { Context } from "hono";
import { findPdfById, listAllPdfs } from "./catalog.ts";
import {
  computeOutputPaths,
  formatFiles,
  writeDefinitionFiles,
} from "./define.ts";
import { loadJurisdictions } from "./fields.ts";
import {
  applyRenames,
  extractFields,
  extractFieldsFromBytes,
  stripFormFieldStyles,
} from "./pdf.ts";
import { loadExclusions, processPdf } from "./schema.ts";
import { loadSchemaFields, suggestName } from "./suggest.ts";

export async function handleListPdfs(c: Context) {
  return c.json(
    listAllPdfs().map(({ id, title, code, jurisdiction, fieldCount }) => ({
      id,
      title,
      code,
      jurisdiction,
      fieldCount,
    })),
  );
}

export async function handleGetPdfBytes(c: Context) {
  const found = findPdfById(c.req.param("id"));
  if (!found) return c.json({ error: "Not found" }, 404);
  const bytes = readFileSync(found.pdfPath);
  return new Response(bytes, {
    headers: { "Content-Type": "application/pdf" },
  });
}

export async function handleGetFields(c: Context) {
  const found = findPdfById(c.req.param("id"));
  if (!found) return c.json({ error: "Not found" }, 404);
  const fields = await extractFields(found.pdfPath);
  const excluded = loadExclusions(found.pdfDir);
  return c.json(fields.map((f) => ({ ...f, excluded: excluded.has(f.name) })));
}

export async function handleSaveFields(c: Context) {
  const found = findPdfById(c.req.param("id"));
  if (!found) return c.json({ error: "Not found" }, 404);

  const {
    renames = [],
    deletes = [],
    unexcludes = [],
  } = await c.req.json<{
    renames?: Array<{ from: string; to: string }>;
    deletes?: string[];
    unexcludes?: string[];
  }>();

  const oldSchemaFields = new Set(loadSchemaFields(found.pdfPath));

  if (renames.length > 0) await applyRenames(found.pdfPath, renames);

  // Pass rename targets as `keep` so processPdf doesn't auto-exclude them —
  // they're new names that aren't in the old schema yet.
  const keepNames = renames.map((r) => r.to);
  await processPdf(found.pdfPath, {
    exclude: deletes,
    keep: keepNames,
    unexclude: unexcludes,
  });
  formatFiles([join(found.pdfDir, "schema.ts")]);

  const newSchemaFields = loadSchemaFields(found.pdfPath);
  return c.json({
    added: newSchemaFields.filter((f) => !oldSchemaFields.has(f)),
    removed: [...oldSchemaFields].filter((f) => !newSchemaFields.includes(f)),
  });
}

export async function handleAddPdf(c: Context) {
  const { title, code, jurisdiction, pdfBase64 } = await c.req.json<{
    title?: string;
    code?: string;
    jurisdiction?: string;
    pdfBase64?: string;
  }>();

  if (!title || !jurisdiction || !pdfBase64) {
    return c.json(
      { error: "title, jurisdiction, and pdfBase64 are required" },
      400,
    );
  }

  const { id, pdfDir, pdfDestPath, indexPath, testPath } = computeOutputPaths({
    title,
    code: code ?? "",
    jurisdiction,
  });

  if (existsSync(indexPath)) {
    return c.json({ error: `PDF "${id}" already exists` }, 409);
  }

  const rawBytes = Buffer.from(pdfBase64, "base64");
  const pdfDoc = await PDFDocument.load(rawBytes);
  stripFormFieldStyles(pdfDoc);
  const cleanedBytes = await pdfDoc.save();

  const pdfFields = await extractFieldsFromBytes(cleanedBytes);

  writeDefinitionFiles({
    id,
    title,
    code: code ?? "",
    jurisdiction,
    pdfDir,
    pdfDestPath,
    indexPath,
    testPath,
    pdfFields,
    pdfBytes: cleanedBytes,
  });

  await processPdf(pdfDestPath);
  formatFiles([join(pdfDir, "schema.ts")]);

  return c.json({ id, fieldCount: pdfFields.length });
}

export async function handlePreviewReplace(c: Context) {
  const found = findPdfById(c.req.param("id"));
  if (!found) return c.json({ error: "Not found" }, 404);

  const { pdfBase64 } = await c.req.json<{ pdfBase64?: string }>();
  if (!pdfBase64) return c.json({ error: "pdfBase64 is required" }, 400);

  // Include excluded fields so they can be offered as rename targets.
  const activeOldNames = new Set(loadSchemaFields(found.pdfPath));
  const excludedOldNames = loadExclusions(found.pdfDir);
  const oldNames = new Set([...activeOldNames, ...excludedOldNames]);

  const newBytes = Buffer.from(pdfBase64, "base64");
  const newFields = await extractFieldsFromBytes(newBytes);
  const newNames = new Set(newFields.map((f) => f.name));

  const retained = newFields
    .filter((f) => activeOldNames.has(f.name))
    .map((f) => f.name);
  const added = newFields
    .filter((f) => !oldNames.has(f.name))
    .map((f) => f.name);
  const removed = [...oldNames].filter((n) => !newNames.has(n));

  const usedSuggestions = new Set<string>();
  const autoMappings: Record<string, string> = {};
  for (const field of newFields.filter((f) => !oldNames.has(f.name))) {
    const available = removed.filter((n) => !usedSuggestions.has(n));
    const suggestion = suggestName(field.name, available);
    if (suggestion) {
      autoMappings[field.name] = suggestion;
      usedSuggestions.add(suggestion);
    }
  }

  return c.json({ newFields, retained, added, removed, autoMappings });
}

export async function handleReplacePdf(c: Context) {
  const found = findPdfById(c.req.param("id"));
  if (!found) return c.json({ error: "Not found" }, 404);

  const {
    pdfBase64,
    renames = [],
    deletes = [],
  } = await c.req.json<{
    pdfBase64?: string;
    renames?: Array<{ from: string; to: string }>;
    deletes?: string[];
  }>();
  if (!pdfBase64) return c.json({ error: "pdfBase64 is required" }, 400);

  const oldSchemaFields = new Set(loadSchemaFields(found.pdfPath));
  const oldBytes = readFileSync(found.pdfPath);
  const schemaPath = join(found.pdfDir, "schema.ts");
  const oldSchemaContent = readFileSync(schemaPath, "utf8");

  try {
    const newBytes = Buffer.from(pdfBase64, "base64");
    const pdfDoc = await PDFDocument.load(newBytes);
    stripFormFieldStyles(pdfDoc);
    writeFileSync(found.pdfPath, await pdfDoc.save());

    if (renames.length > 0) await applyRenames(found.pdfPath, renames);

    // Keep all non-deleted fields: retained old fields plus any new fields the
    // user chose not to delete. This prevents processPdf's auto-exclude from
    // silently dropping rename targets and brand-new fields.
    const deleteSet = new Set(deletes);
    const allNewFields = await extractFields(found.pdfPath);
    const keepNames = allNewFields
      .map((f) => f.name)
      .filter((n) => !deleteSet.has(n));

    await processPdf(found.pdfPath, { exclude: deletes, keep: keepNames });
    formatFiles([schemaPath]);
  } catch (err) {
    writeFileSync(found.pdfPath, oldBytes);
    writeFileSync(schemaPath, oldSchemaContent);
    throw err;
  }

  const newSchemaFields = loadSchemaFields(found.pdfPath);
  return c.json({
    added: newSchemaFields.filter((f) => !oldSchemaFields.has(f)),
    removed: [...oldSchemaFields].filter((f) => !newSchemaFields.includes(f)),
    unchanged: newSchemaFields.filter((f) => oldSchemaFields.has(f)),
    fieldCount: newSchemaFields.length,
  });
}

export async function handleGetJurisdictions(c: Context) {
  return c.json([
    { name: "Federal", abbreviation: "federal" },
    ...loadJurisdictions(),
  ]);
}
