import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Editor } from "@tiptap/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorLinkButton } from "./EditorLinkButton";

describe("EditorLinkButton", () => {
  const mockEditor = {
    chain: () => ({
      focus: () => ({
        extendMarkRange: () => ({
          setLink: () => ({ run: vi.fn() }),
          unsetLink: () => ({ run: vi.fn() }),
        }),
      }),
    }),
    can: () => ({
      chain: () => ({
        focus: () => ({
          setLink: () => ({ run: () => true }),
        }),
      }),
    }),
    isActive: () => false,
    getAttributes: () => ({ href: "" }),
  } as unknown as Editor;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders link button correctly", () => {
    render(<EditorLinkButton editor={mockEditor} />);
    expect(screen.getByRole("button", { name: "Link" })).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", { name: "URL" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
  });

  it("opens popover when clicking link button and autofocuses URL input", async () => {
    render(<EditorLinkButton editor={mockEditor} />);
    const linkButton = screen.getByRole("button", { name: "Link" });
    fireEvent.click(linkButton);
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: "URL" })).toHaveFocus();
    });
  });

  it("handles keyboard shortcut for link creation", () => {
    render(<EditorLinkButton editor={mockEditor} />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();
  });

  it("handles link creation with valid URL", () => {
    const setLinkSpy = vi.fn();
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          extendMarkRange: () => ({
            setLink: () => ({ run: setLinkSpy }),
            unsetLink: () => ({ run: vi.fn() }),
          }),
        }),
      }),
    } as unknown as Editor;

    render(<EditorLinkButton editor={mockEditorWithSpy} />);

    const linkButton = screen.getByRole("button", { name: "Link" });
    fireEvent.click(linkButton);

    const urlInput = screen.getByRole("textbox", { name: "URL" });
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(setLinkSpy).toHaveBeenCalled();
  });

  it("displays an error when the URL is invalid", () => {
    render(<EditorLinkButton editor={mockEditor} />);
    const linkButton = screen.getByRole("button", { name: "Link" });
    fireEvent.click(linkButton);
    expect(screen.getByRole("textbox", { name: "URL" })).toBeInTheDocument();

    const urlInput = screen.getByRole("textbox", { name: "URL" });
    fireEvent.change(urlInput, { target: { value: "invalid-url" } });

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(screen.getByRole("textbox", { name: "URL" })).toBeInvalid();
  });

  it("handles link removal when URL is empty", () => {
    const unsetLinkSpy = vi.fn();
    const mockEditorWithSpy = {
      ...mockEditor,
      chain: () => ({
        focus: () => ({
          extendMarkRange: () => ({
            setLink: () => ({ run: vi.fn() }),
            unsetLink: () => ({ run: unsetLinkSpy }),
          }),
        }),
      }),
    } as unknown as Editor;

    render(<EditorLinkButton editor={mockEditorWithSpy} />);

    const linkButton = screen.getByRole("button", { name: "Link" });
    fireEvent.click(linkButton);

    const applyButton = screen.getByRole("button", { name: "Apply" });
    fireEvent.click(applyButton);

    expect(unsetLinkSpy).toHaveBeenCalled();
  });

  it("disables button when editor cannot set link", () => {
    const mockDisabledEditor = {
      ...mockEditor,
      can: () => ({
        chain: () => ({
          focus: () => ({
            setLink: () => ({ run: () => false }),
          }),
        }),
      }),
    } as unknown as Editor;

    render(<EditorLinkButton editor={mockDisabledEditor} />);
    expect(screen.getByRole("button", { name: "Link" })).toBeDisabled();
  });
});
