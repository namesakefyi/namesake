import { describe, expect, it } from "vitest";
import { generateQuestSlug } from "../questsModel";

describe("questsModel", () => {
  describe("generateQuestSlug", () => {
    it("should generate a slug from the title for non-core categories", () => {
      const slug = generateQuestSlug("Capital Bank INC", "finance", "MA");
      expect(slug).toBe("capital-bank-inc");
    });

    it("should properly handle state-specific categories", () => {
      const birthCertificateSlug = generateQuestSlug(
        "Test Quest",
        "birthCertificate",
        "MA",
      );
      expect(birthCertificateSlug).toBe("birth-certificate-ma");

      const courtOrderSlug = generateQuestSlug(
        "Test Quest",
        "courtOrder",
        "MA",
      );
      expect(courtOrderSlug).toBe("court-order-ma");

      const stateIdSlug = generateQuestSlug("Test Quest", "stateId", "MA");
      expect(stateIdSlug).toBe("state-id-ma");
    });
  });
});
