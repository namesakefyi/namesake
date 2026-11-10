import { describe, expect, it } from "vitest";
import type { FormData } from "#constants/fields";
import { q } from "#lib/forms/questions";

describe("node builders", () => {
  it("lists the fields composite nodes write", () => {
    expect(q.name("oldName").writes.map((entry) => entry.id)).toEqual([
      "oldFirstName",
      "oldMiddleName",
      "oldLastName",
    ]);
    expect(
      q.address("residence", { county: true }).writes.map((entry) => entry.id),
    ).toEqual([
      "residenceStreetAddress",
      "residenceCity",
      "residenceCounty",
      "residenceState",
      "residenceZipCode",
    ]);
    expect(q.address("parent1").writes.map((entry) => entry.id)).toEqual([
      "parent1StreetAddress",
      "parent1City",
      "parent1State",
      "parent1ZipCode",
    ]);
  });

  it("rejects mismatched fields and options at compile time", () => {
    // @ts-expect-error yesNo only accepts boolean fields
    q.yesNo("oldFirstName");
    // @ts-expect-error shortText doesn't accept fields with declared values
    q.shortText("incomePeriod");
    // @ts-expect-error extra choices must be declared on the field
    q.yesNo("isCurrentlyUnhoused", { extraChoices: ["dontKnow"] });
    // @ts-expect-error only the declared extra choice is allowed
    q.yesNo("isHispanicOrLatino", { extraChoices: ["dontKnow"] });
    const stored: Partial<FormData> = {
      isHispanicOrLatino: "preferNotToAnswer",
      // @ts-expect-error booleans without extra choices store only yes or no
      isCurrentlyUnhoused: "preferNotToAnswer",
    };
    // @ts-expect-error parent addresses have no county
    q.address("parent1", { county: true });
    q.radioGroup("incomePeriod", {
      label: "How often?",
      // @ts-expect-error every declared value needs a label
      options: { weekly: "Weekly", monthly: "Monthly" },
    });
    q.radioGroup("incomePeriod", {
      label: "How often?",
      options: {
        weekly: "Weekly",
        biweekly: "Every two weeks",
        monthly: "Monthly",
        yearly: "Yearly",
        // @ts-expect-error undeclared values are rejected
        daily: "Daily",
      },
    });
    expect(stored.isHispanicOrLatino).toBe("preferNotToAnswer");
  });
});
