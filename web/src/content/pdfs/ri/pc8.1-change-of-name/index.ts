import { definePdf } from "#lib/pdfs/definePdf";
import file from "./pc8.1-change-of-name.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Change of Name",
  code: "PC-8.1",
  canonicalUrl:
    "https://docs.sos.ri.gov/documents/BusinessServices/PC8.1-change-of-name.pdf",
  file,
});
