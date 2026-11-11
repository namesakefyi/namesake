import { definePdf } from "#lib/pdfs/definePdf";
import { pdfSchema } from "./schema";
import file from "./ss5-application-for-social-security-card.pdf";

export default definePdf({
  title: "Application for Social Security Card",
  code: "SS-5",
  canonicalUrl: "https://www.ssa.gov/forms/ss-5.pdf",
  file,
  fields: pdfSchema,
});
