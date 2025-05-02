import { render, screen } from "@testing-library/react";
import type { Editor } from "@tiptap/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorToolbar } from "./EditorToolbar";

describe("EditorToolbar", () => {
  const mockEditor = {
    chain: () => ({
      focus: () => ({
        undo: () => ({ run: vi.fn() }),
        redo: () => ({ run: vi.fn() }),
        toggleHeading: () => ({ run: vi.fn() }),
        toggleBold: () => ({ run: vi.fn() }),
        toggleItalic: () => ({ run: vi.fn() }),
        toggleBlockquote: () => ({ run: vi.fn() }),
        setLink: () => ({ run: vi.fn() }),
        unsetLink: () => ({ run: vi.fn() }),
        toggleOrderedList: () => ({ run: vi.fn() }),
        toggleBulletList: () => ({ run: vi.fn() }),
        toggleSteps: () => ({ run: vi.fn() }),
        toggleButton: () => ({ run: vi.fn() }),
        extendMarkRange: () => ({
          setLink: () => ({ run: vi.fn() }),
          unsetLink: () => ({ run: vi.fn() }),
        }),
        toggleDisclosures: () => ({ run: vi.fn() }),
      }),
    }),
    can: () => ({
      chain: () => ({
        focus: () => ({
          undo: () => ({ run: () => true }),
          redo: () => ({ run: () => true }),
          toggleHeading: () => ({ run: () => true }),
          toggleBold: () => ({ run: () => true }),
          toggleItalic: () => ({ run: () => true }),
          toggleBlockquote: () => ({ run: () => true }),
          setLink: () => ({ run: () => true }),
          unsetLink: () => ({ run: () => true }),
          toggleOrderedList: () => ({ run: () => true }),
          toggleBulletList: () => ({ run: () => true }),
          toggleSteps: () => ({ run: () => true }),
          toggleButton: () => ({ run: () => true }),
          toggleDisclosures: () => ({ run: () => true }),
        }),
      }),
    }),
    isActive: () => false,
    getAttributes: () => ({ href: "" }),
  } as unknown as Editor;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "prompt").mockImplementation(() => null);
  });

  it("renders nothing when editor is not provided", () => {
    const { container } = render(<EditorToolbar editor={null as any} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders basic toolbar with undo/redo buttons", () => {
    render(<EditorToolbar editor={mockEditor} />);

    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Redo" })).toBeInTheDocument();
  });

  it("renders headings section when enabled", () => {
    render(<EditorToolbar editor={mockEditor} extensions={["headings"]} />);

    expect(screen.getByRole("button", { name: "Heading" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Subheading" }),
    ).toBeInTheDocument();
  });

  it("renders basic formatting section when enabled", () => {
    render(<EditorToolbar editor={mockEditor} extensions={["basic"]} />);

    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quote" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unlink" })).toBeInTheDocument();
  });

  it("renders lists section when enabled", () => {
    render(<EditorToolbar editor={mockEditor} extensions={["lists"]} />);

    expect(
      screen.getByRole("button", { name: "Numbered list" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unordered list" }),
    ).toBeInTheDocument();
  });

  it("renders advanced section when enabled", () => {
    render(<EditorToolbar editor={mockEditor} extensions={["advanced"]} />);

    expect(screen.getByRole("button", { name: "Steps" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Button" })).toBeInTheDocument();
  });

  it("renders all sections when all extensions are enabled", () => {
    render(
      <EditorToolbar
        editor={mockEditor}
        extensions={["headings", "basic", "lists", "advanced"]}
      />,
    );

    // Check for presence of at least one button from each section
    expect(screen.getByRole("button", { name: "Heading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Numbered list" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Steps" })).toBeInTheDocument();
  });
});
