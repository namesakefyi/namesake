import { readFileSync, writeFileSync } from "node:fs";
import type { FieldType, FormField, PDFPage } from "@libpdf/core";
import {
  PDF,
  PdfArray,
  PdfDict,
  PdfName,
  PdfRef,
  PdfString,
} from "@libpdf/core";

// Fields within this many PDF points vertically are treated as the same row
// and sorted left-to-right within that row. ~10pt ≈ 4mm.
const SAME_ROW_THRESHOLD = 10;

interface TaggedField {
  field: FormField;
  pageIndex: number;
  y: number;
  x: number;
}

export function fieldReadingOrder(
  fields: FormField[],
  pages: PDFPage[],
): FormField[] {
  const pageByRef = new Map<string, { index: number; height: number }>();
  for (let i = 0; i < pages.length; i++) {
    const ref = pages[i].ref;
    pageByRef.set(`${ref.objectNumber}:${ref.generation}`, {
      index: i,
      height: pages[i].height,
    });
  }

  const tagged: TaggedField[] = fields.map((field) => {
    const widget = field.getWidgets()[0];
    if (!widget) return { field, pageIndex: 0, y: 0, x: 0 };

    const [x1, , , y2] = widget.rect;
    const pageRef = widget.pageRef;
    const refKey =
      pageRef != null ? `${pageRef.objectNumber}:${pageRef.generation}` : null;
    const pageInfo = refKey ? pageByRef.get(refKey) : null;
    const pageIndex = pageInfo?.index ?? 0;
    const pageHeight = pageInfo?.height ?? 792;

    // PDF origin is bottom-left; convert to reading-order (top = 0)
    // using the field's top edge so row grouping aligns with visual baselines.
    const y = pageHeight - y2;
    return { field, pageIndex, y, x: x1 };
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
  type: FieldType;
}

export async function extractFields(pdfPath: string): Promise<PdfFieldInfo[]> {
  return extractFieldsFromBytes(readFileSync(pdfPath));
}

/** Same as extractFields but accepts raw bytes instead of a path. */
export async function extractFieldsFromBytes(
  bytes: Uint8Array | Buffer,
): Promise<PdfFieldInfo[]> {
  const doc = await PDF.load(bytes);
  const form = doc.getForm();
  const sorted = fieldReadingOrder(form?.getFields() ?? [], doc.getPages());
  return sorted.map((f) => ({ name: f.name, type: f.type }));
}

/**
 * Converts all dropdown fields to plain text fields in the PDF on disk.
 * This lets fillPdf write any value without needing to match the PDF's fixed
 * option list, and ensures the generated schema never references dropdown fields.
 */
export async function convertDropdownsToTextFields(
  pdfPath: string,
): Promise<void> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDF.load(bytes);
  const form = doc.getForm();
  let changed = false;
  for (const field of form?.getFields() ?? []) {
    if (field.type === "dropdown") {
      const dict = field.acroField();
      dict.set("FT", PdfName.of("Tx"));
      dict.delete("Opt");
      changed = true;
    }
  }
  if (changed) writeFileSync(pdfPath, await doc.save());
}

export interface Rename {
  from: string;
  to: string;
}

/**
 * Renames fields in the PDF, promoting each to the AcroForm root so the
 * full qualified name becomes just `to` (matching the old pdf-lib behavior of
 * removeField → setParent(undefined) → setPartialName → addField).
 */
export async function applyRenames(
  pdfPath: string,
  renames: Rename[],
): Promise<void> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDF.load(bytes);
  const form = doc.getForm();
  const acroForm = form?.acroForm();
  for (const { from, to } of renames) {
    if (form?.hasField(to)) continue;
    const field = form?.getField(from);
    if (!field) continue;

    const acro = field.acroField();
    const fieldRef = field.getRef();
    const parentRef = acro.getRef("Parent");

    if (parentRef && fieldRef && acroForm) {
      // Remove from parent's /Kids so the full qualified name becomes just `to`
      const parentObj = doc.context.resolve(parentRef);
      if (parentObj instanceof PdfDict) {
        const kids = parentObj.get("Kids");
        if (kids instanceof PdfArray) {
          for (let i = 0; i < kids.length; i++) {
            const item = kids.at(i);
            if (
              item instanceof PdfRef &&
              item.objectNumber === fieldRef.objectNumber
            ) {
              kids.remove(i);
              break;
            }
          }
        }
      }
      acro.delete("Parent");
      acroForm.addField(fieldRef);
    }

    acro.set("T", PdfString.fromString(to));
  }
  writeFileSync(pdfPath, await doc.save());
}
