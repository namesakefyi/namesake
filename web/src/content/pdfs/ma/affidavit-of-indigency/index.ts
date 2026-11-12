import { definePdf } from "#lib/pdfs/definePdf";
import file from "./affidavit-of-indigency.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Affidavit of Indigency",
  canonicalUrl: "https://www.mass.gov/doc/affidavit-of-indigency/download",
  file,
});
