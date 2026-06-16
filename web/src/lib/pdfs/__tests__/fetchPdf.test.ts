import { describe, expect, it, vi } from "vitest";
import { fetchPdf } from "../fetchPdf";

describe("fetchPdf", () => {
  it("should fetch and validate PDF content", async () => {
    const buffer = await fetchPdf("public/forms/test-form.pdf");
    expect(buffer).toBeInstanceOf(ArrayBuffer);
  });

  it("should throw error for non-existent PDF", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(fetchPdf("/nonexistent.pdf")).rejects.toThrow(
      "Failed to fetch PDF",
    );

    consoleSpy.mockRestore();
  });

  it("should throw error for non-PDF content", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response("<!DOCTYPE html>", {
        status: 200,
        headers: new Headers({
          "content-type": "text/html",
        }),
      }),
    );

    await expect(fetchPdf("/test.pdf")).rejects.toThrow("Invalid content type");
  });
});
