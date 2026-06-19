import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../Button";
import { Tooltip, TooltipTrigger } from "./Tooltip";

// Focus-triggered tooltips show synchronously in React Aria (no warmup delay),
// making them reliable in jsdom tests. Hover-triggered tooltips go through a
// global async timer even when delay={0}, which is React Aria internals and not
// the concern of tests for this thin wrapper component.

function renderTooltip(tooltipProps = {}) {
  return render(
    <TooltipTrigger>
      <Button>Trigger</Button>
      <Tooltip {...tooltipProps}>Helpful tip</Tooltip>
    </TooltipTrigger>,
  );
}

describe("Tooltip", () => {
  describe("visibility", () => {
    it("does not render the tooltip before the trigger is focused", () => {
      renderTooltip();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows the tooltip when the trigger receives keyboard focus", async () => {
      renderTooltip();
      await userEvent.tab();
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("hides the tooltip when focus leaves the trigger", async () => {
      renderTooltip();
      await userEvent.tab();
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      await userEvent.tab();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("renders its children inside the tooltip", async () => {
      renderTooltip();
      await userEvent.tab();
      expect(screen.getByRole("tooltip")).toHaveTextContent("Helpful tip");
    });

    it("renders the arrow SVG inside the tooltip", async () => {
      renderTooltip();
      await userEvent.tab();
      // Tooltip renders in a portal so query via document
      expect(
        document.querySelector('svg path[d="M0 0 L4 4 L8 0"]'),
      ).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("links the trigger to the tooltip via aria-describedby", async () => {
      renderTooltip();
      await userEvent.tab();
      const tooltip = screen.getByRole("tooltip");
      const trigger = screen.getByRole("button", { name: "Trigger" });
      expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
    });
  });
});
