import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { NodeViewProps } from "@tiptap/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ButtonComponent from "./ButtonComponent";

// Mock the NodeViewContent component
vi.mock("@tiptap/react", () => ({
  NodeViewWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="node-view-wrapper">{children}</div>
  ),
  NodeViewContent: () => <span data-testid="button-content">Button Text</span>,
}));

// Mock the router
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    routesByPath: {
      "/forms/social-security": {},
      "/forms/ma-court-order": {},
    },
  }),
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders button with URL in editable mode", () => {
    render(<ButtonComponent {...baseMockProps} />);

    const button = screen.getByRole("button");
    expect(button);
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

    expect(screen.getByText("No link")).toBeInTheDocument();
  });

  it("opens popover with external URL tab selected by default", async () => {
    render(<ButtonComponent {...baseMockProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "External",
    );
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
  });

  it("opens popover with Namesake tab selected when URL is a form path", async () => {
    const props = {
      ...baseMockProps,
      node: {
        ...baseMockProps.node,
        attrs: { href: "/forms/social-security" },
      } as any,
    };
    render(<ButtonComponent {...props} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Namesake",
    );
    const select = screen.getByRole("button", { name: /Select path/i });
    expect(select).toBeInTheDocument();
  });

  it("allows switching between tabs", async () => {
    render(<ButtonComponent {...baseMockProps} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Switch to Namesake tab
    await userEvent.click(screen.getByRole("tab", { name: "Namesake" }));
    expect(
      screen.getByRole("button", { name: /Select path/i }),
    ).toBeInTheDocument();

    // Switch back to External tab
    await userEvent.click(screen.getByRole("tab", { name: "External" }));
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
  });

  it("updates external URL when submitting the form", async () => {
    const mockRun = vi.fn();
    const props = {
      ...baseMockProps,
      editor: {
        ...baseMockProps.editor,
        chain: () => ({
          focus: () => ({
            updateAttributes: (_type: string, attrs: { href: string }) => ({
              run: () => mockRun(attrs),
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

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const input = screen.getByRole("textbox", { name: "URL" });
    await userEvent.clear(input);
    await userEvent.type(input, "https://newurl.com");

    const submitButton = screen.getByRole("button", { name: "Apply" });
    await userEvent.click(submitButton);

    expect(mockRun).toHaveBeenCalledWith({ href: "https://newurl.com" });
  });

  it("updates form path when submitting the form", async () => {
    const mockRun = vi.fn();
    const props = {
      ...baseMockProps,
      editor: {
        ...baseMockProps.editor,
        chain: () => ({
          focus: () => ({
            updateAttributes: (_type: string, attrs: { href: string }) => ({
              run: () => mockRun(attrs),
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

    const button = screen.getByRole("button");
    await userEvent.click(button);

    // Switch to Namesake tab
    await userEvent.click(screen.getByRole("tab", { name: "Namesake" }));

    // Select a form path
    const select = screen.getByRole("button", { name: /Select path/i });
    await userEvent.click(select);
    await userEvent.keyboard("{arrowdown}");
    await userEvent.keyboard("{enter}");

    const submitButton = screen.getByRole("button", { name: "Apply" });
    await userEvent.click(submitButton);

    expect(mockRun).toHaveBeenCalledWith({ href: "/forms/social-security" });
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

    const button = screen.getByRole("button");
    await userEvent.hover(button);

    await waitFor(() => {
      expect(screen.getByText("https://example.com")).toBeInTheDocument();
    });
  });

  it("shows 'Click to add link' tooltip when URL is empty", async () => {
    const props = {
      ...baseMockProps,
      node: {
        ...baseMockProps.node,
        attrs: { href: null },
      } as any,
    };
    render(<ButtonComponent {...props} />);

    const button = screen.getByRole("button");
    await userEvent.hover(button);

    await waitFor(() => {
      expect(screen.getByText("Click to add link")).toBeInTheDocument();
    });
  });
});
