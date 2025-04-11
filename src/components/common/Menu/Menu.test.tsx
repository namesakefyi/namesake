import { Button, DialogTrigger, Menu, MenuItem } from "@/components/common";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("Menu", () => {
  it("renders Menu", async () => {
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

    // Renders the menu popover
    const popover = await screen.findByRole("dialog");
    expect(popover).toBeInTheDocument();
  });
});
