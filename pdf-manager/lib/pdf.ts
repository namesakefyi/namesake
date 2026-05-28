import { readFileSync, writeFileSync } from "node:fs";
import type { PDFField, PDFPage } from "@cantoo/pdf-lib";
import { PDFDocument, PDFName } from "@cantoo/pdf-lib";

// Fields within this many PDF points vertically are treated as the same row
// and sorted left-to-right within that row. ~5pt ≈ 2mm.
const SAME_ROW_THRESHOLD = 5;

interface TaggedField {
  field: PDFField;
  pageIndex: number;
  y: number;
  x: number;
}

/**
 * Returns pdf-lib field objects sorted in document reading order:
 * page (ascending) → top edge (descending PDF y) → left edge (ascending x).
 * Fields on the same visual row (within SAME_ROW_THRESHOLD pts) are ordered
 * left-to-right.
 */
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

/** Returns { name, type }[] for every form field, sorted in reading order. */
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

/** Removes borders and backgrounds from all form field widgets (mutates in place). */
export function stripFormFieldStyles(pdfDoc: PDFDocument): void {
  const form = pdfDoc.getForm();
  for (const field of form.getFields()) {
    for (const widget of field.acroField.getWidgets()) {
      widget.dict.delete(PDFName.of("AP"));
      const borderStyle = (widget as any).getOrCreateBorderStyle?.();
      if (borderStyle) borderStyle.setWidth(0);
      const ac = (widget as any).getOrCreateAppearanceCharacteristics?.();
      if (ac) {
        ac.dict.delete(PDFName.of("BG"));
        ac.dict.delete(PDFName.of("BC"));
      }
    }
  }
}

export interface Rename {
  from: string;
  to: string;
}

/** Applies [{ from, to }] renames to the PDF and saves it in place. */
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
