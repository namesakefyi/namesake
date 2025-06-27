import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button, DialogTrigger, Popover } from "@/components/common";

describe("Popover", () => {
  it("should render with an accessible title", async () => {
    render(
      <DialogTrigger>
        <Button>Open</Button>
        <Popover className="max-w-[250px]">
          <p className="text-sm">
            For help accessing your account, please contact support.
          </p>
        </Popover>
      </DialogTrigger>,
    );

    const popoverTrigger = screen.getByRole("button", {
      name: "Open",
    });
    userEvent.click(popoverTrigger);

    const popover = await screen.findByRole("dialog");
    expect(popover).toBeInTheDocument();
  });
});
