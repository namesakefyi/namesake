import { describe, expect, it } from "vitest";
import { node } from "../steps";

describe("node builders", () => {
  it("lists the fields composite nodes write", () => {
    expect(node.name("oldName").writes.map((entry) => entry.id)).toEqual([
      "oldFirstName",
      "oldMiddleName",
      "oldLastName",
    ]);
    expect(
      node
        .address("residence", { county: true })
        .writes.map((entry) => entry.id),
    ).toEqual([
      "residenceStreetAddress",
      "residenceCity",
      "residenceCounty",
      "residenceState",
      "residenceZipCode",
    ]);
    expect(node.address("parent1").writes.map((entry) => entry.id)).toEqual([
      "parent1StreetAddress",
      "parent1City",
      "parent1State",
      "parent1ZipCode",
    ]);
  });

  it("rejects mismatched fields and options at compile time", () => {
    // @ts-expect-error yesNo only accepts boolean fields
    node.yesNo("oldFirstName");
    // @ts-expect-error shortText doesn't accept fields with declared values
    node.shortText("incomePeriod");
    // @ts-expect-error parent addresses have no county
    node.address("parent1", { county: true });
    node.radioGroup("incomePeriod", {
      label: "How often?",
      // @ts-expect-error every declared value needs a label
      options: { weekly: "Weekly", monthly: "Monthly" },
    });
    node.radioGroup("incomePeriod", {
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
    expect(true).toBe(true);
  });
});
