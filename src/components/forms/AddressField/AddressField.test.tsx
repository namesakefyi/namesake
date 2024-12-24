import { JURISDICTIONS } from "@convex/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AddressField } from "./AddressField";

describe("AddressField", () => {
  it("renders all address input fields", () => {
    render(<AddressField />);

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
    render(<AddressField />);

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
    render(
      <AddressField>
        <div data-testid="child-component">Additional Info</div>
      </AddressField>,
    );

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });

  it("includes all autocomplete attributes", () => {
    render(<AddressField />);

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    // const stateSelect = screen.getByLabelText("Statel");
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toHaveAttribute(
      "autocomplete",
      "street-address",
    );
    expect(cityInput).toHaveAttribute("autocomplete", "address-level2");

    // RAC currently doesn't pass down autoComplete
    // Fixed in https://github.com/adobe/react-spectrum/pull/7452
    // Waiting for react-aria-components to update npm package; uncomment after
    // expect(stateSelect).toHaveAttribute("autocomplete", "address-level1");
    expect(zipInput).toHaveAttribute("autocomplete", "postal-code");
  });
});
