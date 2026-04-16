import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { DialogTrigger } from "../Dialog";
import { Popover } from "./Popover";

function renderPopover(popoverProps = {}) {
  return render(
    <DialogTrigger>
      <Button>Open popover</Button>
      <Popover {...popoverProps}>
        <p>Popover content</p>
      </Popover>
    </DialogTrigger>,
  );
}

describe("Popover", () => {
  describe("visibility", () => {
    it("does not render content before the trigger is clicked", () => {
      renderPopover();
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });

    it("renders content after the trigger is clicked", async () => {
      renderPopover();
      await userEvent.click(
        screen.getByRole("button", { name: "Open popover" }),
      );
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });

    it("closes when Escape is pressed", async () => {
      renderPopover();
      await userEvent.click(
        screen.getByRole("button", { name: "Open popover" }),
      );
      expect(screen.getByText("Popover content")).toBeInTheDocument();
      await userEvent.keyboard("{Escape}");
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });

    it("closes when clicking outside the popover", async () => {
      renderPopover();
      await userEvent.click(
        screen.getByRole("button", { name: "Open popover" }),
      );
      expect(screen.getByText("Popover content")).toBeInTheDocument();
      await userEvent.click(document.body);
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });
  });

  describe("arrow", () => {
    it("renders the arrow SVG by default", async () => {
      render(
        <DialogTrigger>
          <Button>Open</Button>
          <Popover>
            <p>With arrow</p>
          </Popover>
        </DialogTrigger>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      // The popover renders in a portal so query via document, not container
      expect(
        document.querySelector('svg path[d="M0 0 L6 6 L12 0"]'),
      ).toBeInTheDocument();
    });

    it("omits the arrow SVG when hideArrow is true", async () => {
      render(
        <DialogTrigger>
          <Button>Open</Button>
          <Popover hideArrow>
            <p>No arrow</p>
          </Popover>
        </DialogTrigger>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(
        document.querySelector('svg path[d="M0 0 L6 6 L12 0"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("renders arbitrary children inside the popover", async () => {
      render(
        <DialogTrigger>
          <Button>Open</Button>
          <Popover>
            <p>Help text</p>
            <a href="/docs">Learn more</a>
          </Popover>
        </DialogTrigger>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Help text")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Learn more" }),
      ).toBeInTheDocument();
    });
  });
});
