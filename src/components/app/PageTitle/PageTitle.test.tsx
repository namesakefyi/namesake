import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageTitle } from "./PageTitle";

describe("PageTitle", () => {
  it("renders the title correctly with default values", () => {
    render(<PageTitle title="Court Order" />);
    expect(document.title).toEqual("Court Order · Namesake");
  });

  it("renders the title with custom divider", () => {
    render(<PageTitle title="Court Order" divider=" - " />);
    expect(document.title).toEqual("Court Order - Namesake");
  });

  it("renders the title with custom site title", () => {
    render(<PageTitle title="Test Page" siteTitle="Namesake Beta" />);
    expect(document.title).toEqual("Test Page · Namesake Beta");
  });

  it("hides the divider when site title is not provided", () => {
    render(<PageTitle title="Test Page" siteTitle={null} />);
    expect(document.title).toEqual("Test Page");
  });

  it("trims whitespace from title and site title", () => {
    render(<PageTitle title="  Whitespace  " siteTitle="  Namesake  " />);
    expect(document.title).toEqual("Whitespace · Namesake");
  });
});
