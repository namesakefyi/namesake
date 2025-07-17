import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocumentPreview } from "./DocumentPreview";

describe("DocumentPreview", () => {
  let createObjectURL: typeof URL.createObjectURL;

  beforeEach(() => {
    createObjectURL = URL.createObjectURL;

    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();

    URL.createObjectURL = createObjectURL;
  });

  it("renders PDF in iframe when loaded", () => {
    const fakeBytes = new Uint8Array([1, 2, 3]);
    render(<DocumentPreview pdfBytes={fakeBytes} />);

    const iframe = screen.getByTitle("PDF Viewer");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src");
  });

  it("renders empty div when no PDF bytes", () => {
    render(<DocumentPreview pdfBytes={null} />);
    const iframe = screen.queryByTitle("PDF Viewer");
    expect(iframe).not.toBeInTheDocument();
  });

  it("hides toolbar by default", () => {
    const fakeBytes = new Uint8Array([1, 2, 3]);
    render(<DocumentPreview pdfBytes={fakeBytes} />);

    const iframe = screen.getByTitle("PDF Viewer");
    expect(iframe).toHaveAttribute("src", "blob:mock-url#toolbar=0&navpanes=0");
  });

  it("shows toolbar when hideDefaultToolbar is false", () => {
    const fakeBytes = new Uint8Array([1, 2, 3]);
    render(<DocumentPreview pdfBytes={fakeBytes} hideDefaultToolbar={false} />);

    const iframe = screen.getByTitle("PDF Viewer");
    expect(iframe).toHaveAttribute("src", "blob:mock-url");
  });
});
