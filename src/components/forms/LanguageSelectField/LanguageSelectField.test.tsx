import { renderWithFormProvider, screen } from "@tests/test-utils";
import languageNameMap from "language-name-map/map";
import { describe, expect, it } from "vitest";
import { LanguageSelectField } from "./LanguageSelectField";

describe("LanguageSelectField", () => {
  it("renders language select field", () => {
    renderWithFormProvider(<LanguageSelectField name="language" />);

    const languageSelect = screen.getByLabelText("Language");
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect).toHaveTextContent("Select a language");
  });

  it("renders languages sorted by English name", async () => {
    renderWithFormProvider(<LanguageSelectField name="language" />);

    const languageOptions = screen.getAllByRole("option", {
      // Non-empty options
      name: /[\S\s]+[\S]+/,
      hidden: true,
    });

    // Check that options are sorted alphabetically by name
    const sortedLanguages = Object.entries(languageNameMap)
      .sort(([_, { name: aName }], [_2, { name: bName }]) =>
        aName.localeCompare(bName),
      )
      .map(([lang]) => lang);

    languageOptions.forEach((option, index) => {
      expect(option).toHaveValue(sortedLanguages[index]);
    });
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <LanguageSelectField name="language">
        <div data-testid="child-component">Additional Info</div>
      </LanguageSelectField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });
});
