import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { JURISDICTIONS } from "#constants/jurisdictions";
import type { GeoapifyResult } from "#lib/utils/fetchLocationResults.ts";
import { renderWithFormProvider, screen } from "../test-utils";
import { AddressField, mapPlaceToFields } from "./AddressField";

// useAsyncList can modify state on mount, so every test needs
// to act and wait right after rendering before checking state.
async function waitForAsyncList() {
  await act(async () => {});
}

describe("AddressField", () => {
  it("renders all address input fields", async () => {
    renderWithFormProvider(<AddressField type="residence" />);
    await waitForAsyncList();

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      name: "State",
    });
    const zipInput = screen.getByLabelText("ZIP");

    expect(streetAddressInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(stateSelect).toBeInTheDocument();
    expect(zipInput).toBeInTheDocument();
  });

  it("allows entering address details", async () => {
    renderWithFormProvider(<AddressField type="residence" />);
    await waitForAsyncList();

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      name: "State",
    });
    const zipInput = screen.getByLabelText("ZIP");

    await userEvent.type(streetAddressInput, "123 Main St");
    await userEvent.type(cityInput, "Anytown");

    // Select a state
    await userEvent.click(stateSelect);
    const californiaOption = screen.getByRole("option", {
      name: JURISDICTIONS.ca.name,
    });
    await userEvent.click(californiaOption);

    await userEvent.type(zipInput, "12345-6789");

    expect(streetAddressInput).toHaveValue("123 Main St");
    expect(cityInput).toHaveValue("Anytown");
    expect(stateSelect).toHaveValue("California");
    expect(zipInput).toHaveValue("12345-6789");
  });

  it("supports optional children", async () => {
    renderWithFormProvider(
      <AddressField type="residence">
        <div data-testid="child-component">Additional Info</div>
      </AddressField>,
    );
    await waitForAsyncList();

    const childComponent = screen.getByTestId("child-component");
    expect(childComponent).toBeInTheDocument();
  });

  it("includes all autocomplete attributes", async () => {
    renderWithFormProvider(<AddressField type="residence" />);

    await waitForAsyncList();

    const streetAddressInput = screen.getByLabelText("Street address");
    const cityInput = screen.getByLabelText("City");
    const stateSelect = screen.getByRole("combobox", {
      hidden: true,
    });
    const zipInput = screen.getByLabelText("ZIP");

    // Street uses its own location suggestions, so browser autofill is disabled.
    expect(streetAddressInput).toHaveAttribute("autocomplete", "off");
    expect(cityInput).toHaveAttribute("autocomplete", "address-level2");
    expect(stateSelect).toHaveAttribute("autocomplete", "address-level1");
    expect(zipInput).toHaveAttribute("autocomplete", "postal-code");
  });

  it("renders the correct names for the residence type", async () => {
    renderWithFormProvider(<AddressField type="residence" />);
    await waitForAsyncList();

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

  it("renders the correct names for the mailing type", async () => {
    renderWithFormProvider(<AddressField type="mailing" />);
    await waitForAsyncList();

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

  it("does not show address2 field or toggle by default", async () => {
    renderWithFormProvider(<AddressField type="residence" />);
    await waitForAsyncList();

    expect(
      screen.queryByLabelText("Apartment, suite, unit, etc."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Add apartment, suite, unit, etc.",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows toggle instead of address2 field when includeAddress2 is true", async () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />);
    await waitForAsyncList();

    expect(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Apartment, suite, unit, etc."),
    ).not.toBeInTheDocument();
  });

  it("reveals address2 field when toggle is clicked", async () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />);
    await waitForAsyncList();

    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );

    expect(
      screen.getByLabelText("Apartment, suite, unit, etc."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Add apartment, suite, unit, etc.",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows address2 field immediately when field has a pre-existing value", async () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />, {
      defaultValues: { residenceStreetAddress2: "Apt 4B" },
    });
    await waitForAsyncList();

    const address2Input = screen.getByLabelText("Apartment, suite, unit, etc.");
    expect(address2Input).toBeInTheDocument();
    expect(address2Input).toHaveValue("Apt 4B");
    expect(
      screen.queryByRole("button", {
        name: "Add apartment, suite, unit, etc.",
      }),
    ).not.toBeInTheDocument();
  });

  it("uses correct field name and autocomplete for address2", async () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />);
    await waitForAsyncList();

    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );

    const address2Input = screen.getByLabelText("Apartment, suite, unit, etc.");
    expect(address2Input).toHaveAttribute("name", "residenceStreetAddress2");
    expect(address2Input).toHaveAttribute("autocomplete", "address-line2");
  });

  it("uses correct field name for mailing address2", async () => {
    renderWithFormProvider(<AddressField type="mailing" includeAddress2 />);
    await waitForAsyncList();

    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );

    expect(
      screen.getByLabelText("Apartment, suite, unit, etc."),
    ).toHaveAttribute("name", "mailingStreetAddress2");
  });

  it("does not show county selection by default", async () => {
    renderWithFormProvider(<AddressField type="residence" />);
    await waitForAsyncList();

    expect(screen.queryByLabelText("County")).not.toBeInTheDocument();
  });

  it("shows county selection when includeCounty is true", async () => {
    renderWithFormProvider(<AddressField type="residence" includeCounty />);
    await waitForAsyncList();

    const countyInput = screen.getByLabelText("County");
    expect(countyInput).toBeInTheDocument();
  });

  it("renders the correct name for county field based on address type", async () => {
    renderWithFormProvider(<AddressField type="residence" includeCounty />);
    await waitForAsyncList();

    // Select New York to show county field
    const stateSelect = screen.getByRole("combobox", {
      name: "State",
    });
    await userEvent.click(stateSelect);
    const newYorkOption = screen.getByRole("option", {
      name: JURISDICTIONS.ny.name,
    });
    await userEvent.click(newYorkOption);

    const countyInput = screen.getByLabelText("County");
    expect(countyInput).toHaveAttribute("name", "residenceCounty");
  });
});

describe("mapPlaceToFields", () => {
  const place: GeoapifyResult = {
    address_line1: "100 Main St",
    city: "Boston",
    state_code: "MA",
    postcode: "02108",
    county: "Suffolk",
    street: "Main St",
    housenumber: "100",
    formatted: "100 Main St, Boston, MA 02108",
    place_id: "1",
  };

  it("maps geoapify properties onto the address type's field names", () => {
    expect(
      mapPlaceToFields(place, {
        street: "residenceStreetAddress",
        city: "residenceCity",
        state: "residenceState",
        zip: "residenceZipCode",
        county: "residenceCounty",
      }),
    ).toEqual([
      ["residenceStreetAddress", "100 Main St"],
      ["residenceCity", "Boston"],
      ["residenceState", "MA"],
      ["residenceZipCode", "02108"],
      ["residenceCounty", "Suffolk"],
    ]);
  });

  it("skips fields the address type doesn't have, like county for parents", () => {
    const fields = mapPlaceToFields(place, {
      street: "parent1StreetAddress",
      city: "parent1City",
      state: "parent1State",
      zip: "parent1ZipCode",
    });

    expect(fields.map(([name]) => name)).toEqual([
      "parent1StreetAddress",
      "parent1City",
      "parent1State",
      "parent1ZipCode",
    ]);
  });
});
