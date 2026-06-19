import { User } from "@react-aria/test-utils";
import userEvent from "@testing-library/user-event";
import languageNameMap from "language-name-map/map";
import { describe, expect, it, vi } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { LanguageSelectField } from "./LanguageSelectField";

vi.mock("language-name-map/map", () => ({
  default: {
    en: { name: "English", native: "English" },
    fr: { name: "French", native: "Français" },
    de: { name: "German", native: "Deutsch" },
    es: { name: "Spanish", native: "Español" },
    zh: { name: "Chinese", native: "中文" },
  },
}));

describe("LanguageSelectField", () => {
  const testUtilUser = new User({ interactionType: "mouse" });

  it("renders language select field", () => {
    renderWithFormProvider(<LanguageSelectField name="language" />);

    const languageSelect = screen.getByRole("combobox");
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect).toHaveAttribute("placeholder", "Select a language");
  });

  it("renders all languages", async () => {
    renderWithFormProvider(<LanguageSelectField name="language" />);

    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox"),
      interactionType: "keyboard",
    });
    await comboboxTester.open();
    expect(comboboxTester.listbox).toBeInTheDocument();

    const languageOptions = comboboxTester.options();
    expect(languageOptions).toHaveLength(Object.keys(languageNameMap).length);
  });

  it("filters languages by native name", async () => {
    const user = userEvent.setup();
    renderWithFormProvider(<LanguageSelectField name="language" />);

    const comboboxTester = testUtilUser.createTester("ComboBox", {
      root: screen.getByRole("combobox"),
      interactionType: "keyboard",
    });
    await comboboxTester.open();

    // Type "Fra" to filter for French
    await user.keyboard("Fra");

    expect(comboboxTester.options()).toHaveLength(1);
    expect(comboboxTester.options()[0]).toHaveTextContent(/French/);

    await user.keyboard("{Backspace}{Backspace}{Backspace}");
    await user.keyboard("espa");

    expect(comboboxTester.options()).toHaveLength(1);
    expect(comboboxTester.options()[0]).toHaveTextContent(/Spanish/);
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
