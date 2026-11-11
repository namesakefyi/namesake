import { definePdf } from "#lib/pdfs/definePdf";
import file from "./affidavit-of-indigency.pdf";
import type { pdfSchema } from "./schema";

export default definePdf<typeof pdfSchema>({
  title: "Affidavit of Indigency",
  canonicalUrl: "https://www.mass.gov/doc/affidavit-of-indigency/download",
  file,
});
