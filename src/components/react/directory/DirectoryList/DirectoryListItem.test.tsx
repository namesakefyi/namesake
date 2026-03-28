import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DIRECTORY_CONTACTS_LIST_QUERY_RESULT } from "@/sanity/sanity.types";
import { DirectoryListItem } from "./DirectoryListItem";

const baseContact: DIRECTORY_CONTACTS_LIST_QUERY_RESULT[number] = {
  name: "Example Org",
  slug: "example-org",
  description: "Helps with name changes.",
  states: ["California", "Oregon"],
  services: ["legal", "notary"],
  logo: null,
  email: "hello@example.org",
  phone: "555-0100",
  url: "https://www.example.org/",
  officialPartner: false,
};

describe("DirectoryListItem", () => {
  it("renders name and description", () => {
    render(<DirectoryListItem {...baseContact} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Example Org" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Helps with name changes.")).toBeInTheDocument();
  });

  it("renders service labels from SERVICE_LABELS", () => {
    render(<DirectoryListItem {...baseContact} />);
    const list = screen.getByRole("list", { name: "Services" });
    expect(list).toHaveTextContent("Legal support");
    expect(list).toHaveTextContent("Notary");
  });

  it("shows the partner badge when officialPartner is true", () => {
    render(<DirectoryListItem {...baseContact} officialPartner />);
    expect(screen.getByText("Namesake Partner")).toBeInTheDocument();
  });

  it("does not show the partner badge when officialPartner is false", () => {
    render(<DirectoryListItem {...baseContact} officialPartner={false} />);
    expect(screen.queryByText("Namesake Partner")).not.toBeInTheDocument();
  });

  it("renders states as directory filter links and contact links", () => {
    render(<DirectoryListItem {...baseContact} />);
    expect(screen.getByRole("link", { name: "California" })).toHaveAttribute(
      "href",
      "/directory?state=ca",
    );
    expect(screen.getByRole("link", { name: "Oregon" })).toHaveAttribute(
      "href",
      "/directory?state=or",
    );
    expect(
      screen.getByRole("link", { name: "hello@example.org" }),
    ).toHaveAttribute("href", "mailto:hello@example.org");
    expect(screen.getByRole("link", { name: "555-0100" })).toHaveAttribute(
      "href",
      "tel:555-0100",
    );
    expect(screen.getByRole("link", { name: "example.org" })).toHaveAttribute(
      "href",
      "https://www.example.org/",
    );
  });

  it("omits contact links when email, phone, and url are empty", () => {
    render(
      <DirectoryListItem
        {...baseContact}
        email={null}
        phone={null}
        url=""
        states={[]}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders an unrecognized state name as plain text", () => {
    render(<DirectoryListItem {...baseContact} states={["Fictional State"]} />);
    expect(screen.getByText("Fictional State")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Fictional State" }),
    ).not.toBeInTheDocument();
  });

  it("does not render a logo when logo is null", () => {
    const { container } = render(<DirectoryListItem {...baseContact} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
