import { definePdf } from "#lib/pdfs/definePdf";
import file from "./pc8.1-change-of-name.pdf";
import type { pdfSchema } from "./schema";

export default definePdf<typeof pdfSchema>({
  title: "Change of Name",
  code: "PC-8.1",
  canonicalUrl:
    "https://docs.sos.ri.gov/documents/BusinessServices/PC8.1-change-of-name.pdf",
  file,
});
