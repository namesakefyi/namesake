import { definePdf } from "#lib/pdfs/definePdf";
import type { pdfSchema } from "./schema";
import file from "./ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf";

export default definePdf<typeof pdfSchema>({
  title:
    "Name Change and/or Sex Designation Change Petition for Individual Adult",
  code: "UCS-NC1",
  canonicalUrl: "https://www.nycourts.gov/media/32631",
  file,
});
