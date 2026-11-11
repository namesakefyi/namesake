import { describe, expect, it } from "vitest";
import type { Step } from "#constants/forms";
import { q } from "#lib/forms/questions";
import { getStepFields } from "../getStepFields";

describe("getStepFields", () => {
  it("combines the subsection and question conditions", () => {
    const step: Step = {
      id: "body",
      title: "Body",
      questions: [
        q.yesNo("hasPreviousNameChange", { label: "Changed before?" }),
        q.subsection(
          [
            q.shortText("previousNameFrom", {
              when: (data) => Boolean(data.previousNameTo),
              label: "From",
            }),
          ],
          { when: (data) => data.hasPreviousNameChange === true },
        ),
      ],
    };
    const [, from] = getStepFields(step);
    expect(
      from.when?.({ hasPreviousNameChange: true, previousNameTo: "A" }),
    ).toBe(true);
    expect(
      from.when?.({ hasPreviousNameChange: true, previousNameTo: "" }),
    ).toBe(false);
    expect(
      from.when?.({ hasPreviousNameChange: false, previousNameTo: "A" }),
    ).toBe(false);
  });

  it("uses a titled subsection's title for its single unlabeled question", () => {
    const step: Step = {
      id: "subsection",
      title: "Have you changed your name before?",
      questions: [
        q.yesNo("hasPreviousNameChange"),
        q.subsection([q.shortText("previousNameFrom")], {
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
      questions: [
        q.yesNo("hasPreviousNameChange"),
        q.shortText("previousNameFrom"),
      ],
    };
    expect(() => getStepFields(step)).toThrow(/more than one unlabeled field/);
  });

  it("prefers review labels, then labels, for the review table", () => {
    const step: Step = {
      id: "labels",
      title: "Labels",
      questions: [
        q.shortText("occupation", {
          label: "Job",
          reviewLabel: "Occupation",
        }),
        q.phone("phoneNumber"),
        q.name("newName"),
        q.radioGroup("incomePeriod", {
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
      questions: [q.pronounSelect()],
    };
    const other = getStepFields(step)[1];
    expect(other.id).toBe("otherPronouns");
    expect(other.when?.({ pronouns: ["she/her"] })).toBe(false);
    expect(other.when?.({ pronouns: ["other"] })).toBe(true);
  });
});
