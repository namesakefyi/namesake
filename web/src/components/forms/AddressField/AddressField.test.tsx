import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JURISDICTIONS } from "#constants/jurisdictions";
import { renderWithFormProvider, screen } from "../test-utils";
import { AddressField } from "./AddressField";

describe("AddressField", () => {
  it("renders all address input fields", () => {
    renderWithFormProvider(<AddressField type="residence" />);

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
      name: JURISDICTIONS.CA,
    });
    await userEvent.click(californiaOption);

    await userEvent.type(zipInput, "12345-6789");

    expect(streetAddressInput).toHaveValue("123 Main St");
    expect(cityInput).toHaveValue("Anytown");
    expect(stateSelect).toHaveValue("California");
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

    expect(streetAddressInput).toHaveAttribute("autocomplete", "address-line1");
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

  it("does not show address2 field or toggle by default", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    expect(
      screen.queryByLabelText("Apartment, suite, unit, etc."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Add apartment, suite, unit, etc.",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows toggle instead of address2 field when includeAddress2 is true", () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />);

    expect(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Apartment, suite, unit, etc."),
    ).not.toBeInTheDocument();
  });

  it("reveals address2 field when toggle is clicked", async () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />);

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

  it("shows address2 field immediately when field has a pre-existing value", () => {
    renderWithFormProvider(<AddressField type="residence" includeAddress2 />, {
      defaultValues: { residenceStreetAddress2: "Apt 4B" },
    });

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

    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );

    const address2Input = screen.getByLabelText("Apartment, suite, unit, etc.");
    expect(address2Input).toHaveAttribute("name", "residenceStreetAddress2");
    expect(address2Input).toHaveAttribute("autocomplete", "address-line2");
  });

  it("uses correct field name for mailing address2", async () => {
    renderWithFormProvider(<AddressField type="mailing" includeAddress2 />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add apartment, suite, unit, etc." }),
    );

    expect(
      screen.getByLabelText("Apartment, suite, unit, etc."),
    ).toHaveAttribute("name", "mailingStreetAddress2");
  });

  it("does not show county selection by default", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    expect(screen.queryByLabelText("County")).not.toBeInTheDocument();
  });

  it("shows county selection when includeCounty is true", () => {
    renderWithFormProvider(<AddressField type="residence" includeCounty />);

    const countyInput = screen.getByLabelText("County");
    expect(countyInput).toBeInTheDocument();
  });

  it("renders the correct name for county field based on address type", async () => {
    renderWithFormProvider(<AddressField type="residence" includeCounty />);

    // Select New York to show county field
    const stateSelect = screen.getByRole("combobox", {
      name: "State",
    });
    await userEvent.click(stateSelect);
    const newYorkOption = screen.getByRole("option", {
      name: JURISDICTIONS.NY,
    });
    await userEvent.click(newYorkOption);

    const countyInput = screen.getByLabelText("County");
    expect(countyInput).toHaveAttribute("name", "residenceCounty");
  });
});

describe("AddressField with Geoapify autocomplete", () => {
  const SUGGESTION = {
    place_id: "place-1",
    formatted: "123 Main Street, Springfield, IL 62704, United States",
    address_line1: "123 Main Street",
    city: "Springfield",
    state_code: "il",
    county: "Sangamon County",
    postcode: "62704",
  };

  beforeEach(() => {
    vi.stubEnv("PUBLIC_GEOAPIFY_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the street field as a combobox when enabled", () => {
    renderWithFormProvider(<AddressField type="residence" />);

    expect(
      screen.getByRole("combobox", { name: "Street address" }),
    ).toBeInTheDocument();
  });

  it("autofills sibling fields when a suggestion is selected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ results: [SUGGESTION] }), {
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );

    renderWithFormProvider(<AddressField type="residence" includeCounty />);

    const streetInput = screen.getByRole("combobox", {
      name: "Street address",
    });
    await userEvent.type(streetInput, "123 Main");

    const option = await screen.findByRole(
      "option",
      { name: /123 Main Street/ },
      { timeout: 2000 },
    );
    await userEvent.click(option);

    expect(streetInput).toHaveValue("123 Main Street");
    expect(screen.getByLabelText("City")).toHaveValue("Springfield");
    expect(screen.getByLabelText("ZIP")).toHaveValue("62704");
    expect(screen.getByLabelText("County")).toHaveValue("Sangamon County");
  });
});
