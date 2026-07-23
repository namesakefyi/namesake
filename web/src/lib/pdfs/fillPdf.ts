import type { FormData } from "#constants/fields";
import type { PDFDefinition, PDFFieldValue } from "#constants/pdf";
import { fetchPdf } from "./fetchPdf";
import { loadPdfLib } from "./loadPdfLib";

/**
 * Fill out a PDF form with the given user data.
 * @returns PDF bytes for the filled form.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
    const { PDF, StandardFonts } = await loadPdfLib();

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields (PDF.load requires Uint8Array, not ArrayBuffer)
    const pdfDoc = await PDF.load(new Uint8Array(formPdfBytes));

    // Set the title
    pdfDoc.setTitle(pdf.title);
    pdfDoc.setAuthor("Filled by Namesake Collaborative");

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from the resolver
    const fields = pdf.resolver(userData);
    form?.fill(
      Object.fromEntries(
        Object.entries(fields).filter(
          (e): e is [string, NonNullable<PDFFieldValue>] => e[1] != null,
        ),
      ),
    );

    // Old method of drawing did not work for checkbox groups, so drawing
    // permanent X marks into the page content using this method.
    // This is opt-in, currently only used for LIC100.
    if (pdf.drawFormControlValues && form) {
      const pages = pdfDoc.getPages();

      // Match each widget to its owning page before drawing in PDF coordinates.
      const drawMark = (widget: {
        pageRef: { objectNumber: number; generation: number } | null;
        rect: [number, number, number, number];
      }) => {
        const pageRef = widget.pageRef;
        const page = pages.find(
          (candidate) =>
            pageRef != null &&
            candidate.ref.objectNumber === pageRef.objectNumber &&
            candidate.ref.generation === pageRef.generation,
        );
        if (!page) return;

        const [x1, y1, x2, y2] = widget.rect;
        const size = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 0.9;
        page.drawText("X", {
          x: Math.min(x1, x2) + size * 0.08,
          y: Math.min(y1, y2) + size * 0.02,
          size,
          font: StandardFonts.HelveticaBold,
        });
      };

      for (const [name, value] of Object.entries(fields)) {
        const checkbox = form.getCheckbox(name);
        if (checkbox) {
          // Read the filled state so checkbox groups mark only their selected widget.
          const selectedValue = checkbox.getValue();
          if (selectedValue !== "Off") {
            for (const widget of checkbox.getWidgets()) {
              if (widget.getOnValue() === selectedValue) drawMark(widget);
            }
          }
          continue;
        }

        if (typeof value !== "string") continue;

        const radio = form.getRadioGroup(name);
        if (!radio) continue;

        // Radio export values can differ from widget appearance-state names.
        const options = radio.getOptions();
        const exportIndex = radio.getExportValues().indexOf(value);
        const selectedAppearance =
          exportIndex >= 0 ? options[exportIndex] : value;
        for (const widget of radio.getWidgets()) {
          if (widget.getOnValue() === selectedAppearance) drawMark(widget);
        }
      }
    }

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
