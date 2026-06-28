import "@testing-library/jest-dom/vitest";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, vi } from "vitest";

// jsdom does not implement the Web Animations API used by react-aria-components'
// SelectionIndicator. Provide a minimal stub so affected components render
// without throwing during tests.
if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// Mock fetch for PDF tests
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = input.toString();

    // Handle file paths (either relative like "public/forms/..." or absolute like "/src/forms/...")
    // Check if this looks like a file path rather than a full URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const relativePath = url.startsWith("/") ? url.slice(1) : url;
      // Fall back to public/ so Vite's static assets resolve correctly in tests
      const candidates = [
        path.join(process.cwd(), relativePath),
        path.join(process.cwd(), "public", relativePath),
      ];
      const filePath = candidates.find(fs.existsSync) ?? candidates[0];

      try {
        const buffer = fs.readFileSync(filePath);
        // Determine content type based on file extension
        const contentType = filePath.endsWith(".pdf")
          ? "application/pdf"
          : filePath.endsWith(".png")
            ? "image/png"
            : "application/octet-stream";

        return Promise.resolve(
          new Response(buffer, {
            status: 200,
            statusText: "OK",
            headers: new Headers({
              "content-type": contentType,
            }),
          }),
        );
      } catch (_error) {
        return Promise.resolve(
          new Response(null, {
            status: 404,
            statusText: `File not found: ${filePath}`,
            headers: new Headers({
              "content-type": "text/html",
            }),
          }),
        );
      }
    }

    // Reject unhandled HTTP requests so tests don't silently hit real servers
    throw new Error(`Unmocked HTTP request in test: ${url}`);
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});
