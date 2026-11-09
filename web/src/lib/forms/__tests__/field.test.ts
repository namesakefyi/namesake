import { describe, expect, it } from "vitest";
import { block, field } from "../steps";

describe("field and block builders", () => {
  it("lists the fields composite nodes write", () => {
    expect(field.name("oldName").writes.map((entry) => entry.id)).toEqual([
      "oldFirstName",
      "oldMiddleName",
      "oldLastName",
    ]);
    expect(
      field
        .address("residence", { county: true })
        .writes.map((entry) => entry.id),
    ).toEqual([
      "residenceStreetAddress",
      "residenceCity",
      "residenceCounty",
      "residenceState",
      "residenceZipCode",
    ]);
    expect(field.address("parent1").writes.map((entry) => entry.id)).toEqual([
      "parent1StreetAddress",
      "parent1City",
      "parent1State",
      "parent1ZipCode",
    ]);
  });

  it("types what composite nodes write", () => {
    const withCounty = field.address("residence", { county: true });
    const plain = field.address("residence");
    const county: (typeof withCounty.writes)[number]["id"] = "residenceCounty";
    // @ts-expect-error the county isn't written unless requested
    const missing: (typeof plain.writes)[number]["id"] = "residenceCounty";
    const first: ReturnType<
      typeof field.name<"oldName">
    >["writes"][number]["id"] = "oldFirstName";
    expect([county, missing, first]).toHaveLength(3);
  });

  it("rejects mismatched fields and options at compile time", () => {
    // @ts-expect-error yesNo only accepts boolean fields
    field.yesNo("oldFirstName");
    // @ts-expect-error shortText doesn't accept fields with declared values
    field.shortText("incomePeriod");
    // @ts-expect-error parent addresses have no county
    field.address("parent1", { county: true });
    field.radioGroup("incomePeriod", {
      label: "How often?",
      // @ts-expect-error every declared value needs a label
      options: { weekly: "Weekly", monthly: "Monthly" },
    });
    field.radioGroup("incomePeriod", {
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
    // @ts-expect-error block.custom must declare what it writes
    block.custom({ render: () => null });
    // @ts-expect-error block.custom must label each field it writes
    block.custom({ writes: ["email"], render: () => null });
    expect(true).toBe(true);
  });
});
