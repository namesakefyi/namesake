import { describe, expect, it } from "vitest";
import { markdownToHtml } from "./MarkdownText";

describe("markdownToHtml", () => {
  it("renders links and bold text in a paragraph", () => {
    expect(
      markdownToHtml("**Note:** read the [guide](https://example.com)."),
    ).toBe(
      '<p><strong>Note:</strong> read the <a href="https://example.com">guide</a>.</p>',
    );
  });

  it("keeps blank-line-separated blocks as paragraphs and lists", () => {
    expect(markdownToHtml("Examples:\n\n- One\n- Two\n\nThe end.")).toBe(
      "<p>Examples:</p><ul><li>One</li><li>Two</li></ul><p>The end.</p>",
    );
  });
});
