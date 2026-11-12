import { definePdf } from "#lib/pdfs/definePdf";
import type { Fields } from "./schema";
import file from "./ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf";

export default definePdf<Fields>({
  title:
    "Name Change and/or Sex Designation Change Petition for Individual Adult",
  code: "UCS-NC1",
  canonicalUrl: "https://www.nycourts.gov/media/32631",
  file,
});
