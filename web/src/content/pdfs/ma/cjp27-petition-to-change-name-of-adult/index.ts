import { definePdf } from "#lib/pdfs/definePdf";
import file from "./cjp27-petition-to-change-name-of-adult.pdf";
import { pdfSchema } from "./schema";

export default definePdf({
  title: "Petition to Change Name of Adult",
  code: "CJP-27",
  canonicalUrl:
    "https://www.mass.gov/doc/petition-to-change-name-of-adult-cjp-27/download",
  file,
  fields: pdfSchema,
});
