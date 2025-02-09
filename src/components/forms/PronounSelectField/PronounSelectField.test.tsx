import { COMMON_PRONOUNS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PronounSelectField } from "./PronounSelectField";

describe("PronounSelectField", () => {
  it("renders pronoun select field", () => {
    render(<PronounSelectField />);

    const pronounsLabel = screen.getByText("Pronouns");
    expect(pronounsLabel).toBeInTheDocument();
  });

  it("renders all common pronouns", () => {
    render(<PronounSelectField />);

    for (const pronoun of COMMON_PRONOUNS) {
      const pronounTag = screen.getByText(pronoun);
      expect(pronounTag).toBeInTheDocument();
    }
  });

  it("renders 'other pronouns' option", () => {
    render(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    expect(otherPronounsTag).toBeInTheDocument();
  });

  it("allows multiple pronoun selection", async () => {
    render(<PronounSelectField />);

    const theyThemTag = screen.getByRole("row", {
      name: "they/them/theirs",
    });
    const sheHerTag = screen.getByRole("row", { name: "she/her/hers" });

    await userEvent.click(theyThemTag);
    await userEvent.click(sheHerTag);

    expect(theyThemTag).toHaveAttribute("data-selected", "true");
    expect(sheHerTag).toHaveAttribute("data-selected", "true");
  });

  it("shows text field when 'other pronouns' is selected", async () => {
    render(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    await userEvent.click(otherPronounsTag);

    const otherPronounsInput = screen.getByLabelText("List other pronouns");
    expect(otherPronounsInput).toBeInTheDocument();
  });

  it("allows entering custom pronouns", async () => {
    render(<PronounSelectField />);

    const otherPronounsTag = screen.getByText("other pronouns");
    await userEvent.click(otherPronounsTag);

    const otherPronounsInput = screen.getByLabelText("List other pronouns");
    await userEvent.type(otherPronounsInput, "ze/zir/zirs");

    expect(otherPronounsInput).toHaveValue("ze/zir/zirs");
  });
});
