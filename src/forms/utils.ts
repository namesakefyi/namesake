import type { FormData, PDFDefinition } from "@/constants";
import { smartquotes } from "@/utils/smartquotes";
import { PDFDocument, StandardFonts } from "@cantoo/pdf-lib";

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
 * @returns A URL to the filled PDF.
 */
export async function fillPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}): Promise<Uint8Array> {
  try {
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
    const pdfBytes = await fillPdf({ pdf, userData });
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getForm();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Fill out a PDF form and download it.
 */
export async function downloadPdf({
  pdf,
  userData,
}: {
  pdf: PDFDefinition;
  userData: Partial<FormData>;
}) {
  const pdfBytes = await fillPdf({ pdf, userData });
  if (!pdfBytes) return;

  const url = URL.createObjectURL(new Blob([pdfBytes]));

  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdf.title}.pdf`;
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
  const url = URL.createObjectURL(new Blob([mergedPdfBytes]));

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
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height, width } = page.getSize();

  function drawBulletList(title: string, items: string[], y: number) {
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1.5,
    });

    page.drawText(title, {
      x: 50,
      y: y - 20,
      size: 14,
      font: helveticaBold,
    });

    const listText = items
      .filter((item) => item.trim().length > 0)
      .map((item) => `• ${smartquotes(item)}`)
      .join("\n");

    page.drawText(listText, {
      x: 55,
      y: y - 50,
      size: 12,
      font: helvetica,
      maxWidth: 500,
      wordBreaks: [" "],
      lineHeight: 18,
    });
  }

  page.drawText("Name Change Packet", {
    x: 50,
    y: height - 70,
    size: 14,
    font: helveticaBold,
  });

  page.drawText(title, {
    x: 49,
    y: height - 110,
    size: 32,
    lineHeight: 36,
    maxWidth: 500,
    wordBreaks: [" "],
    font: helveticaBold,
  });

  drawBulletList(
    "Included Documents",
    documents.map((doc) =>
      doc.code ? `${doc.title} (${doc.code})` : doc.title,
    ),
    height - 170,
  );

  drawBulletList("Instructions", instructions, height - 340);

  try {
    const logoResponse = await fetch("/forms/pdf-cover-logo.png");
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedPng(new Uint8Array(logoBytes));

    page.drawImage(logoImage, {
      x: 50,
      y: 110,
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
  const generatedOn = `Document generated from https://app.namesake.fyi on ${currentDate}.`;
  page.drawText(generatedOn, {
    x: 50,
    y: 80,
    size: 9,
    lineHeight: 11,
    font: helvetica,
  });

  const disclaimer =
    "Disclaimer: The information provided by Namesake is for general informational purposes and does not constitute legal advice. Use of namesake.fyi does not create an attorney-client relationship between you and Namesake.";
  page.drawText(disclaimer, {
    x: 50,
    y: 60,
    size: 9,
    font: helvetica,
    maxWidth: 500,
    wordBreaks: [" "],
    lineHeight: 11,
  });

  return await pdfDoc.save();
}
