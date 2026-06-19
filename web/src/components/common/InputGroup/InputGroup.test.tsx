import { render, screen } from "@testing-library/react";
import { Input } from "react-aria-components";
import { describe, expect, it } from "vitest";
import { InputGroup } from "./InputGroup";

describe("InputGroup", () => {
  describe("label", () => {
    it("renders the label text when provided", () => {
      render(<InputGroup label="Date of birth" />);
      expect(screen.getByText("Date of birth")).toBeInTheDocument();
    });

    it("renders no label element when label is omitted", () => {
      render(<InputGroup />);
      // The group still renders but without any label span
      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.queryByRole("span")).not.toBeInTheDocument();
    });

    it("gives the group an accessible name from the label", () => {
      render(<InputGroup label="Date of birth" />);
      expect(
        screen.getByRole("group", { name: "Date of birth" }),
      ).toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("renders its children inside the group", () => {
      render(
        <InputGroup label="Date of birth">
          <input aria-label="Month" />
          <input aria-label="Day" />
          <input aria-label="Year" />
        </InputGroup>,
      );

      expect(
        screen.getByRole("textbox", { name: "Month" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Day" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Year" })).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("marks the group as disabled when isDisabled is true", () => {
      render(<InputGroup label="Date of birth" isDisabled />);
      expect(screen.getByRole("group")).toHaveAttribute("data-disabled");
    });

    it("does not mark the group as disabled by default", () => {
      render(<InputGroup label="Date of birth" />);
      expect(screen.getByRole("group")).not.toHaveAttribute("data-disabled");
    });

    it("propagates disabled state to React Aria Input children", () => {
      render(
        <InputGroup label="Date of birth" isDisabled>
          <Input aria-label="Month" />
        </InputGroup>,
      );

      expect(screen.getByRole("textbox", { name: "Month" })).toBeDisabled();
    });
  });

  describe("additional props", () => {
    it("forwards extra props to the group element", () => {
      render(<InputGroup label="Date of birth" data-testid="my-group" />);
      expect(screen.getByTestId("my-group")).toBeInTheDocument();
    });
  });
});
