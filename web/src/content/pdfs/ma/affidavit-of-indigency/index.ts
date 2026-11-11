import { definePdf } from "#lib/pdfs/definePdf";
import file from "./affidavit-of-indigency.pdf";
import { pdfSchema } from "./schema";

export default definePdf({
  title: "Affidavit of Indigency",
  canonicalUrl: "https://www.mass.gov/doc/affidavit-of-indigency/download",
  file,
  fields: pdfSchema,
});
