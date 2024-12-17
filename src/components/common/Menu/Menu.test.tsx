import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { DialogTrigger } from "../Dialog";
import { Menu, MenuItem } from "./Menu";

describe("Menu", () => {
  it("renders Menu with accessible title", async () => {
    render(
      <DialogTrigger>
        <Button>Open Menu</Button>
        <Menu>
          <MenuItem id="item1">Item 1</MenuItem>
          <MenuItem id="item2">Item 2</MenuItem>
        </Menu>
      </DialogTrigger>,
    );

    const button = screen.getByRole("button", { name: "Open Menu" });
    userEvent.click(button);

    // Renders the menu
    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();

    // Renders the accessible title
    const title = await screen.findByRole("dialog", {
      name: "Select an option",
    });
    expect(title).toBeInTheDocument();
  });
});
