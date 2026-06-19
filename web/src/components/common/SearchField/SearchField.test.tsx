import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  describe("label", () => {
    it("renders the label when provided", () => {
      render(<SearchField label="Search" />);
      expect(screen.getByText("Search")).toBeInTheDocument();
    });

    it("renders no label when omitted", () => {
      render(<SearchField aria-label="Search" placeholder="Search…" />);
      expect(screen.queryByRole("label")).not.toBeInTheDocument();
    });

    it("gives the input an accessible name from the label", () => {
      render(<SearchField label="Search" />);
      expect(
        screen.getByRole("searchbox", { name: "Search" }),
      ).toBeInTheDocument();
    });
  });

  describe("input", () => {
    it("renders a searchbox", () => {
      render(<SearchField label="Search" />);
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("renders the placeholder text", () => {
      render(<SearchField aria-label="Search" placeholder="Type to search…" />);
      expect(screen.getByRole("searchbox")).toHaveAttribute(
        "placeholder",
        "Type to search…",
      );
    });

    it("accepts typed input", async () => {
      render(<SearchField label="Search" />);
      await userEvent.type(screen.getByRole("searchbox"), "hello");
      expect(screen.getByRole("searchbox")).toHaveValue("hello");
    });

    it("calls onChange as the user types", async () => {
      const onChange = vi.fn();
      render(<SearchField label="Search" onChange={onChange} />);
      await userEvent.type(screen.getByRole("searchbox"), "hi");
      expect(onChange).toHaveBeenCalledWith("hi");
    });
  });

  describe("clear button", () => {
    it("renders a clear button", () => {
      render(<SearchField label="Search" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("clears the input when the clear button is pressed", async () => {
      render(<SearchField label="Search" defaultValue="hello" />);
      expect(screen.getByRole("searchbox")).toHaveValue("hello");
      await userEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("calls onClear when the clear button is pressed", async () => {
      const onClear = vi.fn();
      render(
        <SearchField label="Search" defaultValue="hello" onClear={onClear} />,
      );
      await userEvent.click(screen.getByRole("button"));
      expect(onClear).toHaveBeenCalledOnce();
    });
  });

  describe("description", () => {
    it("renders description text when provided", () => {
      render(<SearchField label="Search" description="Search by name." />);
      expect(screen.getByText("Search by name.")).toBeInTheDocument();
    });

    it("renders no description when omitted", () => {
      render(<SearchField label="Search" />);
      expect(screen.queryByText("Search by name.")).not.toBeInTheDocument();
    });
  });

  describe("error message", () => {
    it("renders a string error message when invalid", () => {
      render(
        <SearchField label="Search" isInvalid errorMessage="Invalid query." />,
      );
      expect(screen.getByText("Invalid query.")).toBeInTheDocument();
    });

    it("renders an error message from a function when invalid", () => {
      render(
        <SearchField
          label="Search"
          isInvalid
          errorMessage={() => "Computed error."}
        />,
      );
      expect(screen.getByText("Computed error.")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables the input when isDisabled is true", () => {
      render(<SearchField label="Search" isDisabled />);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });

    it("does not call onChange when disabled", async () => {
      const onChange = vi.fn();
      render(<SearchField label="Search" isDisabled onChange={onChange} />);
      await userEvent.type(screen.getByRole("searchbox"), "hello");
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
