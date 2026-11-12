import { definePdf } from "#lib/pdfs/definePdf";
import file from "./background-check-authorization-of-release.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Background Check Authorization of Release",
  canonicalUrl: "https://riag.ri.gov/media/3906/download",
  file,
});
