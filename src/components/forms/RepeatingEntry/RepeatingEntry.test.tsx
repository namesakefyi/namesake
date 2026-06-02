import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithFormProvider, screen } from "../test-utils";
import { RepeatingEntry } from "./RepeatingEntry";

function renderEntry(
  props?: Partial<React.ComponentProps<typeof RepeatingEntry>>,
) {
  return renderWithFormProvider(
    <RepeatingEntry name="previousAddresses" {...props}>
      {(value, onChange, index) => (
        <input
          aria-label={`Address ${index + 1}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </RepeatingEntry>,
  );
}

describe("RepeatingEntry", () => {
  it("renders one entry by default", () => {
    renderEntry();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("renders min entries on mount", () => {
    renderEntry({ min: 2 });
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("shows Add button when below max", () => {
    renderEntry({ max: 3 });
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("hides Add button when at max", () => {
    renderEntry({ min: 3, max: 3 });
    expect(
      screen.queryByRole("button", { name: /add/i }),
    ).not.toBeInTheDocument();
  });

  it("adds an entry when Add is clicked", async () => {
    renderEntry({ max: 3 });
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("hides Add button after reaching max", async () => {
    renderEntry({ min: 1, max: 2 });
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(
      screen.queryByRole("button", { name: /add/i }),
    ).not.toBeInTheDocument();
  });

  it("hides Remove button when at min", () => {
    renderEntry({ min: 1 });
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Remove button on last entry when above min", async () => {
    renderEntry({ min: 1, max: 3 });
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("removes the last entry when Remove is clicked", async () => {
    renderEntry({ min: 1, max: 3 });
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("cannot remove below min", async () => {
    renderEntry({ min: 2, max: 3 });
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("passes value and index to children", () => {
    renderEntry({ min: 2 });
    expect(screen.getByLabelText("Address 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Address 2")).toBeInTheDocument();
  });

  it("calls onChange with updated value", async () => {
    renderEntry();
    await userEvent.type(screen.getByLabelText("Address 1"), "123 Main St");
    expect(screen.getByLabelText("Address 1")).toHaveValue("123 Main St");
  });

  it("preserves values in other entries when one changes", async () => {
    renderEntry({ min: 1, max: 3 });
    await userEvent.type(screen.getByLabelText("Address 1"), "First");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    await userEvent.type(screen.getByLabelText("Address 2"), "Second");
    expect(screen.getByLabelText("Address 1")).toHaveValue("First");
    expect(screen.getByLabelText("Address 2")).toHaveValue("Second");
  });
});
