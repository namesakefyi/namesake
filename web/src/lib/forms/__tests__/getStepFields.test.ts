import { describe, expect, it } from "vitest";
import { traceReads, withDeps } from "../conditions";
import { getStepFields } from "../getStepFields";
import { node } from "../steps";
import type { Condition, Step } from "../types";

const ids = (step: Step) => getStepFields(step).map((entry) => entry.id);

describe("getStepFields", () => {
  it("combines the step, subsection and node conditions", () => {
    const step: Step = {
      id: "body",
      title: "Body",
      when: (data) => data.isFilingForSomeoneElse === true,
      body: [
        node.yesNo("hasPreviousNameChange", { label: "Changed before?" }),
        node.subsection(
          [
            node.shortText("previousNameFrom", {
              label: "From",
              when: withDeps(
                (data) => Boolean(data.previousNameTo),
                ["previousNameTo"],
              ),
            }),
          ],
          { when: (data) => data.hasPreviousNameChange === true },
        ),
      ],
    };
    const [, from] = getStepFields(step);
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
    expect(traceReads(from.when as Condition)).toEqual(
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
      body: [node.yesNo("hasPreviousNameChange")],
    };
    expect(getStepFields(step)[0].reviewLabel).toBe(
      "Have you changed your name before?",
    );
  });

  it("uses a titled subsection's title for its single unlabeled question", () => {
    const step: Step = {
      id: "subsection",
      title: "Have you changed your name before?",
      body: [
        node.yesNo("hasPreviousNameChange"),
        node.subsection([node.shortText("previousNameFrom")], {
          title: "What was your previous name?",
        }),
      ],
    };
    expect(getStepFields(step).map((entry) => entry.reviewLabel)).toEqual([
      "Have you changed your name before?",
      "What was your previous name?",
    ]);
  });

  it("rejects more than one unlabeled question", () => {
    const step: Step = {
      id: "two",
      title: "Two",
      body: [
        node.yesNo("hasPreviousNameChange"),
        node.shortText("previousNameFrom"),
      ],
    };
    expect(() => getStepFields(step)).toThrow(/more than one unlabeled field/);
  });

  it("prefers review labels, then labels, for the review table", () => {
    const step: Step = {
      id: "labels",
      title: "Labels",
      body: [
        node.shortText("occupation", {
          label: "Job",
          reviewLabel: "Occupation",
        }),
        node.phone("phoneNumber"),
        node.name("newName"),
        node.radioGroup("incomePeriod", {
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
      ],
    };
    const fields = getStepFields(step);
    expect(fields.map((entry) => entry.reviewLabel)).toEqual([
      "Occupation",
      "Phone number",
      "New first name",
      "New middle name",
      "New last name",
      "How often?",
    ]);
    expect(fields.at(-1)?.options?.biweekly).toEqual({
      label: "Every two weeks",
      description: "26 times a year",
    });
  });

  it("only shows other pronouns when other is selected", () => {
    const step: Step = {
      id: "pronouns",
      title: "Pronouns",
      body: [node.pronounSelect()],
    };
    const other = getStepFields(step)[1];
    expect(other.id).toBe("otherPronouns");
    expect(other.when?.({ pronouns: ["she/her"] })).toBe(false);
    expect(other.when?.({ pronouns: ["other"] })).toBe(true);
  });

  it("caches the fields per step object", () => {
    const step: Step = { id: "cache", title: "Cache", body: [] };
    expect(getStepFields(step)).toBe(getStepFields(step));
    expect(ids({ ...step })).toEqual([]);
  });
});
