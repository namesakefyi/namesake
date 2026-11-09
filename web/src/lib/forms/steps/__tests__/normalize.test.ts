import { describe, expect, it } from "vitest";
import type { Step } from "../../types";
import { block, field } from "../builders";
import { is, isFalse, isTrue, withDeps } from "../conditions";
import { normalizeStep } from "../normalize";

const ids = (step: Step) => normalizeStep(step).fields.map((entry) => entry.id);

describe("builders", () => {
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
    expect(true).toBe(true);
  });
});

describe("conditions", () => {
  it("compares fields exactly", () => {
    expect(
      isTrue("hasPreviousNameChange")({ hasPreviousNameChange: true }),
    ).toBe(true);
    expect(isFalse("hasPreviousNameChange")({})).toBe(false);
    expect(
      isFalse("hasPreviousNameChange")({ hasPreviousNameChange: false }),
    ).toBe(true);
    expect(
      is("incomePeriod", "weekly", "monthly")({ incomePeriod: "monthly" }),
    ).toBe(true);
    expect(is("incomePeriod", "weekly")({ incomePeriod: "yearly" })).toBe(
      false,
    );
  });
});

describe("normalizeStep", () => {
  it("normalizes a legacy step from its fields list", () => {
    const when = (data: { hasPreviousNameChange?: unknown }) =>
      data.hasPreviousNameChange === true;
    const step: Step = {
      id: "legacy",
      title: "Legacy",
      fields: ["hasPreviousNameChange", { id: "previousNameFrom", when }],
      component: () => null,
    };
    const model = normalizeStep(step);
    expect(model.body).toBeNull();
    expect(model.fields.map((entry) => entry.reviewLabel)).toEqual([
      "Has previous name change?",
      "Previous name from",
    ]);
    expect(model.fields[1].when?.({ hasPreviousNameChange: true })).toBe(true);
    expect(model.reads).toEqual(["hasPreviousNameChange"]);
  });

  it("combines the step, subsection and node conditions", () => {
    const step: Step = {
      id: "body",
      title: "Body",
      when: isTrue("isFilingForSomeoneElse"),
      body: [
        field.yesNo("hasPreviousNameChange", { label: "Changed before?" }),
        block.subsection(
          [
            field.shortText("previousNameFrom", {
              label: "From",
              when: withDeps(
                (data) => Boolean(data.previousNameTo),
                ["previousNameTo"],
              ),
            }),
          ],
          { when: isTrue("hasPreviousNameChange") },
        ),
      ],
    };
    const [, from] = normalizeStep(step).fields;
    const base = { isFilingForSomeoneElse: true, hasPreviousNameChange: true };
    expect(from.when?.({ ...base, previousNameTo: "A" })).toBe(true);
    expect(from.when?.({ ...base, previousNameTo: "" })).toBe(false);
    expect(
      from.when?.({
        ...base,
        isFilingForSomeoneElse: false,
        previousNameTo: "A",
      }),
    ).toBe(false);
    expect(normalizeStep(step).reads).toEqual(
      expect.arrayContaining([
        "isFilingForSomeoneElse",
        "hasPreviousNameChange",
        "previousNameTo",
      ]),
    );
  });

  it("uses the step title for the single unlabeled question", () => {
    const step: Step = {
      id: "single",
      title: "Have you changed your name before?",
      body: [field.yesNo("hasPreviousNameChange")],
    };
    expect(normalizeStep(step).fields[0].reviewLabel).toBe(
      "Have you changed your name before?",
    );
  });

  it("rejects more than one unlabeled question", () => {
    const step: Step = {
      id: "two",
      title: "Two",
      body: [
        field.yesNo("hasPreviousNameChange"),
        field.shortText("previousNameFrom"),
      ],
    };
    expect(() => normalizeStep(step)).toThrow(/2 unlabeled fields/);
  });

  it("prefers review labels, then labels, for the review table", () => {
    const step: Step = {
      id: "labels",
      title: "Labels",
      body: [
        field.shortText("occupation", {
          label: "Job",
          reviewLabel: "Occupation",
        }),
        field.phone("phoneNumber"),
        field.name("newName"),
        field.radioGroup("incomePeriod", {
          label: "How often?",
          options: {
            weekly: "Every week",
            biweekly: {
              label: "Every two weeks",
              description: "26 times a year",
            },
            monthly: "Every month",
            yearly: "Every year",
          },
        }),
        block.custom({ writes: ["email"], render: () => null }),
      ],
    };
    const model = normalizeStep(step);
    expect(model.fields.map((entry) => entry.reviewLabel)).toEqual([
      "Occupation",
      "Phone number",
      "New first name",
      "New middle name",
      "New last name",
      "How often?",
      "Email",
    ]);
    expect(model.fields.at(-2)?.options?.biweekly).toEqual({
      label: "Every two weeks",
      description: "26 times a year",
    });
    expect(model.fallbacks).toBe(1);
  });

  it("only shows other pronouns when other is selected", () => {
    const step: Step = {
      id: "pronouns",
      title: "Pronouns",
      body: [field.pronounSelect()],
    };
    const other = normalizeStep(step).fields[1];
    expect(other.id).toBe("otherPronouns");
    expect(other.when?.({ pronouns: ["she/her"] })).toBe(false);
    expect(other.when?.({ pronouns: ["other"] })).toBe(true);
  });

  it("caches the model per step object", () => {
    const step: Step = { id: "cache", title: "Cache", body: [] };
    expect(normalizeStep(step)).toBe(normalizeStep(step));
    expect(ids({ ...step })).toEqual([]);
  });
});
