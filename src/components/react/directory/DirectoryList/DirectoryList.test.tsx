import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { ALL } from "@/constants/all";
import type { DIRECTORY_CONTACTS_LIST_QUERY_RESULT } from "@/sanity/sanity.types";
import { DirectoryList, parseDirectorySearchParams } from "./DirectoryList";

const mockContact: DIRECTORY_CONTACTS_LIST_QUERY_RESULT[number] = {
  name: "Listed Org",
  slug: "listed-org",
  description: "Description here.",
  states: ["Maine"],
  services: ["legal"],
  logo: null,
  email: null,
  phone: null,
  url: "",
  officialPartner: false,
};

describe("parseDirectorySearchParams", () => {
  it("returns empty filters for an empty query string", () => {
    expect(parseDirectorySearchParams("")).toEqual({
      stateSlug: "",
      service: "",
    });
  });

  it("parses a valid state slug and service from URLSearchParams", () => {
    expect(
      parseDirectorySearchParams(new URLSearchParams("state=me&service=legal")),
    ).toEqual({ stateSlug: "me", service: "legal" });
  });

  it("rejects invalid state and unknown service values", () => {
    expect(parseDirectorySearchParams("state=USA&service=nope")).toEqual({
      stateSlug: "",
      service: "",
    });
  });
});

describe("DirectoryList", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(history, "replaceState").mockImplementation(() => {});
    vi.spyOn(global, "fetch").mockImplementation((input: RequestInfo | URL) => {
      if (String(input).includes("/api/directory")) {
        return Promise.resolve(
          new Response(JSON.stringify({ contacts: [mockContact] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      }
      return Promise.reject(new Error(`Unexpected fetch: ${String(input)}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders initial contacts from props", () => {
    render(
      <DirectoryList initialContacts={[mockContact]} initialUrlSearch="" />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Listed Org" }),
    ).toBeInTheDocument();
  });

  it("shows the filtered-empty message when filters are active and the list is empty", () => {
    render(<DirectoryList initialContacts={[]} initialUrlSearch="?state=ca" />);
    expect(
      screen.getByText("No organizations match these filters."),
    ).toBeInTheDocument();
  });

  it("shows Clear filters when a service filter is applied from the URL", () => {
    render(
      <DirectoryList
        initialContacts={[mockContact]}
        initialUrlSearch="?service=legal"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });

  it("refetches when the service select changes", async () => {
    const user = userEvent.setup();
    render(<DirectoryList initialContacts={[]} initialUrlSearch="" />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Service" }),
      "legal",
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: "Listed Org" }),
      ).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalled();
    expect(String(vi.mocked(global.fetch).mock.calls[0]?.[0])).toContain(
      "service=legal",
    );
  });

  it("shows an error message when the directory API returns a non-OK response", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(null, { status: 500 }),
    );
    const user = userEvent.setup();
    render(<DirectoryList initialContacts={[]} initialUrlSearch="" />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "State" }),
      "ca",
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Something went wrong loading the directory/,
      );
    });
  });

  it("clears filters when Clear filters is pressed", async () => {
    const user = userEvent.setup();
    render(
      <DirectoryList
        initialContacts={[mockContact]}
        initialUrlSearch="?state=ca"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    await waitFor(() => {
      const stateSelect = screen.getByRole("combobox", {
        name: "State",
      });
      expect(stateSelect).toHaveValue(ALL);
    });
    expect(history.replaceState).toHaveBeenCalled();
  });
});
