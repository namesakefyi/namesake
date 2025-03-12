import { JURISDICTIONS } from "@convex/constants";
import userEvent from "@testing-library/user-event";
import { renderWithFormProvider, screen } from "@tests/test-utils";
import { describe, expect, it } from "vitest";
import { AddressField } from "./AddressField";

describe("AddressField", () => {
  it("renders all address input fields", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByLabelText("State");
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateSelect).toBeInTheDocument();
    expect(zipInput).toBeInTheDocument();
  });

  it("allows entering address details", async () => {
    renderWithFormProvider(<AddressField type="residence" />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByLabelText("State");
    const zipInput = screen.getByLabelText("ZIP");

    await userEvent.type(streetAddressInput, "123 Main St");
    await userEvent.type(cityInput, "Anytown");

    // Select a state
    await userEvent.click(stateSelect);
    const californiaOption = screen.getByRole("option", {
      name: JURISDICTIONS.CA,
    });
    await userEvent.click(californiaOption);

    await userEvent.type(zipInput, "12345-6789");

    expect(streetAddressInput).toHaveValue("123 Main St");
    expect(cityInput).toHaveValue("Anytown");
    expect(stateSelect).toHaveTextContent("California");
    expect(zipInput).toHaveValue("12345-6789");
  });

  it("supports optional children", () => {
    renderWithFormProvider(
      <AddressField type="residence">
        <div data-testid="child-component">Additional Info</div>
      </AddressField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });

  it("includes all autocomplete attributes", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      hidden: true,
    });
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toHaveAttribute(
      "autocomplete",
      "street-address",
    );
    expect(cityInput).toHaveAttribute("autocomplete", "address-level2");
    expect(stateSelect).toHaveAttribute("autocomplete", "address-level1");
    expect(zipInput).toHaveAttribute("autocomplete", "postal-code");
  });

  it("renders the correct names for the residence type", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      hidden: true,
    });
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toHaveAttribute(
      "name",
      "residenceStreetAddress",
    );
    expect(cityInput).toHaveAttribute("name", "residenceCity");
    expect(stateSelect).toHaveAttribute("name", "residenceState");
    expect(zipInput).toHaveAttribute("name", "residenceZipCode");
  });

  it("renders the correct names for the mailing type", () => {
    renderWithFormProvider(<AddressField type="mailing" />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      hidden: true,
    });
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toHaveAttribute("name", "mailingStreetAddress");
    expect(cityInput).toHaveAttribute("name", "mailingCity");
    expect(stateSelect).toHaveAttribute("name", "mailingState");
    expect(zipInput).toHaveAttribute("name", "mailingZipCode");
  });
});
