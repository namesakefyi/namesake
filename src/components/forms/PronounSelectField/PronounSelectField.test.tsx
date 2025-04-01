import { COMMON_PRONOUNS } from "@convex/constants";
import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import { PronounSelectField } from "./PronounSelectField";

describe("PronounSelectField", () => {
  it("renders pronoun select field", () => {
    renderWithFormProvider(<PronounSelectField />);

    const pronounsLabel = screen.getByText("Pronouns");
    expect(pronounsLabel).toBeInTheDocument();
  });

  it("renders all common pronouns", () => {
    renderWithFormProvider(<PronounSelectField />);

    for (const pronoun of COMMON_PRONOUNS) {
      const pronounTag = screen.getByText(pronoun);
      expect(pronounTag).toBeInTheDocument();
    }
  });

  it("renders 'other pronouns' option", () => {
    renderWithFormProvider(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    expect(otherPronounsTag).toBeInTheDocument();
  });

  it("allows multiple pronoun selection", async () => {
    renderWithFormProvider(<PronounSelectField />);

    const theyThemTag = screen.getByRole("row", { name: "they/them" });
    const sheHerTag = screen.getByRole("row", { name: "she/her" });

    await userEvent.click(theyThemTag);
    await userEvent.click(sheHerTag);

    expect(theyThemTag).toHaveAttribute("data-selected", "true");
    expect(sheHerTag).toHaveAttribute("data-selected", "true");
  });

  it("shows text field when 'other pronouns' is selected", async () => {
    renderWithFormProvider(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    await userEvent.click(otherPronounsTag);

    const otherPronounsInput = screen.getByLabelText("List other pronouns");
    expect(otherPronounsInput).toBeInTheDocument();
  });

  it("allows entering custom pronouns", async () => {
    renderWithFormProvider(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    await userEvent.click(otherPronounsTag);

    const otherPronounsInput = screen.getByLabelText("List other pronouns");
    expect(otherPronounsInput).toHaveAttribute("name", "otherPronouns");
    await userEvent.type(otherPronounsInput, "ze/zir");

    expect(otherPronounsInput).toHaveValue("ze/zir");
  });
});
