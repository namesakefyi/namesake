import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { FieldType, FormField, PDFPage } from "@libpdf/core";
import { PDF, PdfArray, PdfDict, PdfName, PdfString } from "@libpdf/core";

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

export async function loadPdf(bytes: Uint8Array | Buffer): Promise<PDF> {
  const doc = await PDF.load(bytes);
  if (!doc.isEncrypted) return doc;
  return PDF.load(decryptWithQpdf(bytes));
}

/** Same as extractFields but accepts raw bytes instead of a path. */
export async function extractFieldsFromBytes(
  bytes: Uint8Array | Buffer,
): Promise<PdfFieldInfo[]> {
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  const sorted = fieldReadingOrder(form?.getFields() ?? [], doc.getPages());
  return sorted.map((f) => ({ name: f.name, type: f.type }));
}

/**
 * Temporary workaround for https://github.com/LibPDF-js/core/issues/82.
 *
 * When a PDF is encrypted with an empty user password but an unknown owner
 * password, libpdf authenticates successfully (isAuthenticated: true) but
 * removeProtection() throws PermissionDeniedError. Calling save() without
 * removing protection regenerates the /ID trailer entry, invalidating the AES
 * key derivation — the saved file is unreadable. qpdf derives the correct file
 * key from the empty user password and strips encryption without needing the
 * owner password. Remove this function and inline PDF.load() in loadPdf() once
 * libpdf preserves the original /ID on save().
 */
function decryptWithQpdf(bytes: Uint8Array | Buffer): Buffer {
  const tmpDir = mkdtempSync(join(tmpdir(), "namesake-pdf-"));
  try {
    const inPath = join(tmpDir, "input.pdf");
    const outPath = join(tmpDir, "output.pdf");
    writeFileSync(inPath, bytes);
    const result = spawnSync("qpdf", ["--decrypt", inPath, outPath], {
      timeout: 60_000,
    });
    if (result.error) {
      const isNotFound =
        (result.error as NodeJS.ErrnoException).code === "ENOENT";
      throw new Error(
        isNotFound
          ? "qpdf is required to process encrypted PDFs. Install it with: brew install qpdf"
          : `qpdf failed: ${result.error.message}`,
      );
    }
    if (result.status !== 0) {
      throw new Error(
        "PDF is password-protected. Please provide an unprotected version.",
      );
    }
    return readFileSync(outPath);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
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
  const doc = await loadPdf(bytes);
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

/**
 * Renames each radio button's appearance states from opaque numeric keys
 * (e.g. "0", "1", "2") to the human-readable labels stored in the field's
 * Opt array (e.g. "Male", "Female", "X"). After this runs, fillPdf can pass
 * the label string directly and form.fill() will accept it without translation.
 */
export async function normalizeRadioOptionNames(
  pdfPath: string,
): Promise<void> {
  const bytes = readFileSync(pdfPath);
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  let changed = false;

  for (const field of form?.getFields() ?? []) {
    if (field.type !== "radio") continue;

    const acro = field.acroField();
    // Opt: ordered human-readable export values, one per radio button
    const opt = acro.getArray("Opt");
    if (!opt?.length) continue;

    const labels = opt
      .toArray()
      .map((item) => (item instanceof PdfString ? item.asString() : null));

    // Each widget is one radio button; its on-value is its selected state name
    for (const widget of field.getWidgets()) {
      const onValue = widget.getOnValue();
      if (!onValue) continue;

      const idx = Number(onValue);
      if (!Number.isFinite(idx) || idx >= labels.length) continue;
      const label = labels[idx];
      if (!label || label === onValue) continue;

      // Get appearance streams dictionary
      const ap = widget.dict.getDict("AP");
      if (ap) {
        // Rename the state key in normal (N) and down/pressed (D) appearances
        for (const subKey of ["N", "D"]) {
          const sub = ap.getDict(subKey);
          if (!sub?.has(onValue)) continue;
          const val = sub.get(onValue);
          if (val) {
            sub.set(label, val);
            sub.delete(onValue);
          }
        }
      }

      // Update current appearance state if this button is selected
      const as = widget.dict.get("AS");
      if (as instanceof PdfName && as.value === onValue) {
        widget.dict.set("AS", PdfName.of(label));
      }
    }

    // Opt is now redundant — state names are the labels
    acro.delete("Opt");
    changed = true;
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
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  const acroForm = form?.acroForm();
  for (const { from, to } of renames) {
    if (form?.hasField(to)) continue;
    const field = form?.getField(from);
    if (!field) continue;

    const acro = field.acroField();
    const fieldRef = field.getRef();
    const parentRef = acro.getRef("Parent");

    if (!parentRef) {
      acro.set("T", PdfString.fromString(to));
    } else if (fieldRef && acroForm) {
      // PdfRef instances are interned, so identity comparison is correct and simpler.
      const parentObj = doc.context.resolve(parentRef);
      if (parentObj instanceof PdfDict) {
        const kids = parentObj.get("Kids");
        if (kids instanceof PdfArray) {
          for (let i = 0; i < kids.length; i++) {
            if (kids.at(i) === fieldRef) {
              kids.remove(i);
              break;
            }
          }
        }
      }
      acro.delete("Parent");
      acroForm.addField(fieldRef);
      acro.set("T", PdfString.fromString(to));
    }
  }
  writeFileSync(pdfPath, await doc.save());
}
