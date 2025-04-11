import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { NodeViewProps } from "@tiptap/react";
import { describe, expect, it, vi } from "vitest";
import ButtonComponent from "./ButtonComponent";

// Mock the NodeViewContent component
vi.mock("@tiptap/react", () => ({
  NodeViewWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="node-view-wrapper">{children}</div>
  ),
  NodeViewContent: () => <span data-testid="button-content">Button Text</span>,
}));

describe("ButtonComponent", () => {
  const baseMockProps: NodeViewProps = {
    editor: {
      isEditable: true,
      chain: () => ({
        focus: () => ({
          updateAttributes: () => ({
            run: vi.fn(),
          }),
        }),
      }),
    } as any,
    node: {
      attrs: {
        href: "https://example.com",
      },
      type: { name: "button" },
    } as any,
    decorations: [] as any,
    selected: false,
    extension: {} as any,
    getPos: () => 0,
    updateAttributes: () => {},
    deleteNode: () => {},
    view: {} as any,
    innerDecorations: [] as any,
    HTMLAttributes: {},
  };

  it("renders button with URL in editable mode", () => {
    render(<ButtonComponent {...baseMockProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(screen.getByTestId("button-content")).toBeInTheDocument();
  });

  it("shows warning badge when URL is missing", () => {
    const props = {
      ...baseMockProps,
      node: {
        ...baseMockProps.node,
        attrs: { href: null },
      } as any,
    };
    render(<ButtonComponent {...props} />);

    expect(screen.getByText("No URL")).toBeInTheDocument();
  });

  it("opens popover when clicking the button in editable mode", async () => {
    render(<ButtonComponent {...baseMockProps} />);

    const link = screen.getByRole("link");
    await userEvent.click(link);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
  });

  it("updates URL when submitting the form", async () => {
    const mockRun = vi.fn();
    const props = {
      ...baseMockProps,
      editor: {
        ...baseMockProps.editor,
        chain: () => ({
          focus: () => ({
            updateAttributes: () => ({
              run: mockRun,
            }),
          }),
        }),
      } as any,
      node: {
        ...baseMockProps.node,
        attrs: { href: "" },
      } as any,
    };

    render(<ButtonComponent {...props} />);

    const link = screen.getByRole("link");
    await userEvent.click(link);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "https://newurl.com");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(saveButton);

    expect(mockRun).toHaveBeenCalled();
  });

  it("renders as plain link in non-editable mode", () => {
    const props = {
      ...baseMockProps,
      editor: {
        ...baseMockProps.editor,
        isEditable: false,
      } as any,
    };
    render(<ButtonComponent {...props} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(screen.queryByText("Edit link")).not.toBeInTheDocument();
  });

  it("shows tooltip with URL on hover", async () => {
    render(<ButtonComponent {...baseMockProps} />);

    const link = screen.getByRole("link");
    await userEvent.hover(link);

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
    });
  });

  it("shows 'Click to add URL' tooltip when URL is empty", async () => {
    const props = {
      ...baseMockProps,
      node: {
        ...baseMockProps.node,
        attrs: { href: null },
      } as any,
    };
    render(<ButtonComponent {...props} />);

    const link = screen.getByRole("link");
    await userEvent.hover(link);

    await waitFor(() => {
      expect(screen.getByText("Click to add URL")).toBeInTheDocument();
    });
  });
});
