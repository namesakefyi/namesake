import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NativeOption, NativeSelect } from "./NativeSelect";

describe("NativeOption", () => {
  it("renders an option with value and text", () => {
    render(
      <select aria-label="Test">
        <NativeOption value="a">Alpha</NativeOption>
      </select>,
    );
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveValue("a");
  });
});

describe("NativeSelect", () => {
  it("renders options as children", () => {
    render(
      <NativeSelect aria-label="Pick one">
        <NativeOption value="1">One</NativeOption>
        <NativeOption value="2">Two</NativeOption>
      </NativeSelect>,
    );
    expect(
      screen.getByRole("combobox", { name: "Pick one" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "One" })).toHaveValue("1");
    expect(screen.getByRole("option", { name: "Two" })).toHaveValue("2");
  });

  it("renders a visible label linked to the select", () => {
    render(
      <NativeSelect label="Country">
        <NativeOption value="us">United States</NativeOption>
      </NativeSelect>,
    );
    const label = screen.getByText("Country");
    const select = screen.getByRole("combobox", { name: "Country" });
    expect(label).toHaveAttribute("for", select.id);
  });

  it("uses a stable id when id prop is passed", () => {
    render(
      <NativeSelect id="country-select" label="Country">
        <NativeOption value="us">United States</NativeOption>
      </NativeSelect>,
    );
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "id",
      "country-select",
    );
    expect(screen.getByText("Country")).toHaveAttribute(
      "for",
      "country-select",
    );
  });

  it("forwards extra props to the select", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NativeSelect aria-label="Test" onChange={onChange} data-testid="sel">
        <NativeOption value="a">A</NativeOption>
        <NativeOption value="b">B</NativeOption>
      </NativeSelect>,
    );
    expect(screen.getByTestId("sel")).toBeInTheDocument();
    await user.selectOptions(screen.getByTestId("sel"), "b");
    expect(onChange).toHaveBeenCalled();
  });
});
