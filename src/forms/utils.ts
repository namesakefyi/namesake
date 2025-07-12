import type { FormData, PDFDefinition, PDFId } from "@/constants";
import { getPdfDefinition } from "@/forms";
import { smartquotes } from "@/utils/smartquotes";

async function loadPdfLib() {
  const {
    PDFDocument,
    popGraphicsState,
    pushGraphicsState,
    StandardFonts,
    setCharacterSpacing,
  } = await import("@cantoo/pdf-lib");

  return {
    PDFDocument,
    popGraphicsState,
    pushGraphicsState,
    StandardFonts,
    setCharacterSpacing,
  };
}

/**
 * Fetch a PDF file from the /src/forms.
 */
export const fetchPdf = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF from "${path}": ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/pdf")) {
    throw new Error(
      `Invalid content type for "${path}": Expected PDF but got ${contentType}`,
    );
  }

  return response.arrayBuffer();
};

/**
 * Fill out a PDF form with the given user data.
 * @returns A PDF bytes for the filled form.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
    const { PDFDocument } = await loadPdfLib();
    const pdfFields = pdf.fields(userData);

    // Fetch the PDF with form fields
    const formPdfBytes = await fetchPdf(pdf.pdfPath);

    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    // Set the title
    pdfDoc.setTitle(pdf.title);
    pdfDoc.setAuthor("Filled by Namesake Collaborative");

    // Get the form containing all the fields
    const form = pdfDoc.getForm();

    // Fill out each field from our transformed data
    for (const [fieldName, value] of Object.entries(pdfFields)) {
      if (typeof value === "boolean") {
        const checkbox = form.getCheckBox(fieldName);
        value ? checkbox.check() : checkbox.uncheck();
      } else if (typeof value === "string") {
        const field = form.getTextField(fieldName);
        field.setText(value);
      }
    }

    // Serialize the PDFDocument to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This is a helper function that returns the form object from a filled PDF.
 * Useful for testing.
 */
export async function getPdfForm({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}) {
  try {
    const { PDFDocument } = await loadPdfLib();
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getForm();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Given PDF bytes and a title, download the PDF.
 * @param pdfBytes - The PDF bytes to download.
 * @param title - The title of the PDF.
 * @returns A promise that resolves when the PDF is downloaded.
 */
export async function downloadPdf({
  pdfBytes,
  title,
}: {
  pdfBytes: Uint8Array;
  title: string;
}) {
  const url = URL.createObjectURL(new Blob([pdfBytes]));

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Define a PDF form.
 * @returns A PDF definition.
 */
export function definePdf(pdf: PDFDefinition): PDFDefinition {
  return pdf;
}

export async function downloadMergedPdf({
  title,
  instructions,
  pdfs,
  userData,
}: {
  title: string;
  instructions: string[];
  pdfs: PDFDefinition[];
  userData: Partial<FormData>;
}) {
  const { PDFDocument } = await loadPdfLib();
  const mergedPdf = await PDFDocument.create();

  // Create and add cover page
  const coverPageBytes = await createCoverPage({
    title,
    instructions,
    documents: pdfs.map((pdf) => ({
      title: pdf.title,
      code: pdf.code,
    })),
  });
  const coverPageDoc = await PDFDocument.load(coverPageBytes);
  const [coverPage] = await mergedPdf.copyPages(coverPageDoc, [0]);
  mergedPdf.addPage(coverPage);

  // Add the rest of the PDFs
  for (const pdf of pdfs) {
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  const mergedPdfBytes = await mergedPdf.save();
  downloadPdf({ pdfBytes: mergedPdfBytes, title });
}

/**
 * Create a cover page PDF for a document packet.
 */
export async function createCoverPage({
  title,
  instructions,
  documents,
}: {
  title: string;
  instructions: string[];
  documents: Array<{ title: string; code?: string }>;
}): Promise<Uint8Array> {
  const {
    PDFDocument,
    StandardFonts,
    pushGraphicsState,
    popGraphicsState,
    setCharacterSpacing,
  } = await loadPdfLib();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height, width } = page.getSize();

  const margin = 50;
  const contentWidth = width - margin * 2;

  function drawList({
    title,
    items,
    y,
  }: {
    title: string;
    items: string[];
    y: number;
  }) {
    const listOffset = 150;

    page.drawText(smartquotes(title), {
      x: margin,
      y: y,
      size: 16,
      font: helveticaBold,
    });

    const listText = items
      .filter((item) => item.trim().length > 0)
      .map((item) => smartquotes(item))
      .join("\n");

    page.drawText(listText, {
      x: margin + listOffset,
      y: y,
      size: 13,
      font: helvetica,
      maxWidth: contentWidth - listOffset,
      wordBreaks: [" "],
      lineHeight: 21,
    });
  }

  page.drawText("Name Change Packet", {
    x: margin,
    y: height - 65,
    size: 14,
    font: helveticaBold,
  });

  page.drawLine({
    start: { x: margin, y: height - 80 },
    end: { x: width - margin, y: height - 80 },
    thickness: 2.5,
  });

  page.pushOperators(pushGraphicsState(), setCharacterSpacing(-1));
  page.drawText(smartquotes(title), {
    x: margin - 1.5, // Optical fix
    y: height - 130,
    size: 44,
    lineHeight: 48,
    maxWidth: contentWidth,
    wordBreaks: [" "],
    font: helveticaBold,
  });
  page.pushOperators(popGraphicsState());

  drawList({
    title: "Packet Includes",
    items: documents.map((doc) =>
      doc.code ? `${doc.title} (${doc.code})` : doc.title,
    ),
    y: height - 270,
  });

  drawList({
    title: "Instructions",
    items: instructions,
    y: height - 420,
  });

  try {
    const logoResponse = await fetch("/forms/pdf-cover-logo.png");
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes));

    page.drawImage(logoImage, {
      x: margin,
      y: 105,
      height: 16,
      width: 83,
    });
  } catch (error) {
    console.warn("Failed to load or draw logo:", error);
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const generatedOn = `Document generated by https://app.namesake.fyi on ${currentDate}.`;
  page.drawText(smartquotes(generatedOn), {
    x: margin,
    y: 80,
    size: 9,
    lineHeight: 11,
    font: helvetica,
  });

  const disclaimer =
    "Disclaimer: The information provided by Namesake is for general informational purposes and does not constitute legal advice. Use of namesake.fyi does not create an attorney-client relationship between you and Namesake.";
  page.drawText(smartquotes(disclaimer), {
    x: margin,
    y: 60,
    size: 9,
    font: helvetica,
    maxWidth: contentWidth,
    wordBreaks: [" "],
    lineHeight: 11,
  });

  return await pdfDoc.save();
}

/**
 * Load multiple PDFs.
 *
 * @param pdfs - Array of PDF configurations
 * @param pdfs[].pdfId - The ID of the PDF to load
 * @param pdfs[].include - Whether to include this PDF (defaults to `true`)
 * @returns Promise that resolves to an array of PDF definitions
 *
 * @example
 * ```typescript
 * const pdfs = await loadPdfs([
 *   { pdfId: "always-included-pdf" },
 *   { pdfId: "conditional-pdf", include: someCondition },
 * ]);
 * ```
 */
export async function loadPdfs(
  pdfs: Array<{ pdfId: PDFId; include?: boolean }>,
) {
  const pdfIds = pdfs
    .filter(({ include = true }) => include)
    .map(({ pdfId }) => pdfId);

  return await Promise.all(pdfIds.map((pdfId) => getPdfDefinition(pdfId)));
}
