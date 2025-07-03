import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Editor } from "./Editor";

vi.mock("@tiptap/react", () => {
  const mockEditor = {
    getHTML: vi.fn(),
    commands: {
      setContent: vi.fn(),
    },
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
  };

  return {
    useEditor: vi.fn(() => mockEditor),
    EditorContent: ({ className }: any) => (
      // biome-ignore lint/a11y/useSemanticElements: contentEditable div matches implementation
      <div
        aria-label="Editor"
        role="textbox"
        className={className}
        tabIndex={0}
      >
        Editor Content
      </div>
    ),
  };
});

describe("Editor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doesn't show toolbar when not editable", () => {
    render(<Editor editable={false} />);
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("shows toolbar when editable", () => {
    render(<Editor editable={true} />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("applies correct styles when editable", () => {
    const { container } = render(<Editor editable={true} />);
    expect(container.firstChild).toHaveClass("w-full flex-col");
  });

  it("applies correct styles when not editable", () => {
    const { container } = render(<Editor editable={false} />);
    expect(container.firstChild).toHaveClass(
      "border-none rounded-none bg-transparent!",
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("contenteditable");
  });

  it("applies custom className to editor content", () => {
    render(<Editor className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });
});
