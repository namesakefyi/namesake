import { definePdf } from "#lib/pdfs/definePdf";
import file from "./mv44-application-for-permit-driver-license-or-non-driver-id-card.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Application for Permit, Driver License or Non-Driver ID Card",
  code: "MV-44",
  canonicalUrl: "https://dmv.ny.gov/forms/mv44.pdf",
  file,
});
