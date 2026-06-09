import { readFileSync, writeFileSync } from "node:fs";
import type { PDFField, PDFPage } from "@cantoo/pdf-lib";
import { PDFDocument, PDFDropdown, PDFName } from "@cantoo/pdf-lib";

// Fields within this many PDF points vertically are treated as the same row
// and sorted left-to-right within that row. ~10pt ≈ 4mm.
const SAME_ROW_THRESHOLD = 10;

interface TaggedField {
  field: PDFField;
  pageIndex: number;
  y: number;
  x: number;
}

export function fieldReadingOrder(
  fields: PDFField[],
  pages: PDFPage[],
): PDFField[] {
  const pageByRef = new Map<string, { index: number; height: number }>();
  for (let i = 0; i < pages.length; i++) {
    const ref = pages[i].ref;
    pageByRef.set(`${ref.objectNumber}:${ref.generationNumber}`, {
      index: i,
      height: pages[i].getHeight(),
    });
  }

  const tagged: TaggedField[] = fields.map((field) => {
    const widget = field.acroField.getWidgets()[0];
    if (!widget) return { field, pageIndex: 0, y: 0, x: 0 };

    const rect = widget.getRectangle();
    const pRef = widget.P() as
      | { objectNumber?: number; generationNumber?: number }
      | undefined;
    const refKey =
      pRef?.objectNumber != null
        ? `${pRef.objectNumber}:${pRef.generationNumber}`
        : null;
    const pageInfo = refKey ? pageByRef.get(refKey) : null;
    const pageIndex = pageInfo?.index ?? 0;
    const pageHeight = pageInfo?.height ?? 792;

    // PDF origin is bottom-left; convert to reading-order (top = 0)
    // using the field's top edge so row grouping aligns with visual baselines.
    const y = pageHeight - rect.y - rect.height;
    return { field, pageIndex, y, x: rect.x };
  });

  tagged.sort((a, b) => {
    if (a.pageIndex !== b.pageIndex) return a.pageIndex - b.pageIndex;
    if (Math.abs(a.y - b.y) > SAME_ROW_THRESHOLD) return a.y - b.y;
    return a.x - b.x;
  });

  return tagged.map(({ field }) => field);
}

export interface PdfFieldInfo {
  name: string;
  type: "text" | "checkbox";
}

export async function extractFields(pdfPath: string): Promise<PdfFieldInfo[]> {
  return extractFieldsFromBytes(readFileSync(pdfPath));
}

/** Same as extractFields but accepts raw bytes instead of a path. */
export async function extractFieldsFromBytes(
  bytes: Uint8Array | Buffer,
): Promise<PdfFieldInfo[]> {
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  const sorted = fieldReadingOrder(form.getFields(), doc.getPages());
  return sorted.map((f) => ({
    name: f.getName(),
    type: f.constructor.name === "PDFCheckBox" ? "checkbox" : "text",
  }));
}

/**
 * Converts all PDFDropdown fields to plain text fields in the PDF on disk.
 * This lets fillPdf write any value without needing to match the PDF's fixed
 * option list, and ensures the generated schema never references PDFDropdown.
 */
export async function convertDropdownsToTextFields(
  pdfPath: string,
): Promise<void> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  let changed = false;
  for (const field of form.getFields()) {
    if (field instanceof PDFDropdown) {
      field.acroField.dict.set(PDFName.of("FT"), PDFName.of("Tx"));
      field.acroField.dict.delete(PDFName.of("Opt"));
      changed = true;
    }
  }
  if (changed) writeFileSync(pdfPath, await doc.save());
}

export interface Rename {
  from: string;
  to: string;
}

export async function applyRenames(
  pdfPath: string,
  renames: Rename[],
): Promise<void> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes);
  const form = doc.getForm();
  for (const { from, to } of renames) {
    if (form.getFieldMaybe(to)) continue;
    try {
      const field = form.getField(from);
      form.acroForm.removeField(field.acroField);
      field.acroField.setParent(undefined as any);
      field.acroField.setPartialName(to);
      form.acroForm.addField(field.acroField.ref);
    } catch {
      // field not found — skip
    }
  }
  writeFileSync(pdfPath, await doc.save());
}
