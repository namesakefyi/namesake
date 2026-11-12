import { definePdf } from "#lib/pdfs/definePdf";
import file from "./applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title:
    "Applicant Affidavit in Support of Amendment of a Birth Certificate for Sex",
  code: "R-116",
  canonicalUrl:
    "https://www.mass.gov/doc/applicant-affidavit-for-amending-sex-on-a-birth-certificate-2/download",
  file,
});
