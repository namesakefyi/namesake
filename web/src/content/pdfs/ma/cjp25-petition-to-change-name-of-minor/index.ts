import { definePdf } from "#lib/pdfs/definePdf";
import file from "./cjp25-petition-to-change-name-of-minor.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Petition to Change Name of Minor",
  code: "CJP-25",
  canonicalUrl:
    "https://www.mass.gov/doc/petition-to-change-name-of-minor-cjp-25/download",
  file,
});
