import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DisclosureGroup } from "../DisclosureGroup";
import { Disclosure, DisclosureHeader, DisclosurePanel } from "./Disclosure";

// ─── helpers ──────────────────────────────────────────────────────────────────

function renderDisclosure(props = {}) {
  return render(
    <Disclosure {...props}>
      <DisclosureHeader>Account settings</DisclosureHeader>
      <DisclosurePanel>Change your email or password here.</DisclosurePanel>
    </Disclosure>,
  );
}

// ─── Disclosure ───────────────────────────────────────────────────────────────

describe("Disclosure", () => {
  describe("initial state", () => {
    it("renders the trigger button with the header text", () => {
      renderDisclosure();
      expect(
        screen.getByRole("button", { name: /Account settings/ }),
      ).toBeInTheDocument();
    });

    it("is collapsed by default", () => {
      renderDisclosure();
      expect(
        screen.getByRole("button", { name: /Account settings/ }),
      ).toHaveAttribute("aria-expanded", "false");
    });

    it("does not show panel content when collapsed", () => {
      renderDisclosure();
      expect(
        screen.queryByText("Change your email or password here."),
      ).not.toBeVisible();
    });

    it("shows panel content when defaultExpanded is true", () => {
      renderDisclosure({ defaultExpanded: true });
      expect(
        screen.getByText("Change your email or password here."),
      ).toBeVisible();
    });
  });

  describe("toggling", () => {
    it("expands the panel when the trigger is clicked", async () => {
      renderDisclosure();
      await userEvent.click(
        screen.getByRole("button", { name: /Account settings/ }),
      );
      expect(
        screen.getByText("Change your email or password here."),
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: /Account settings/ }),
      ).toHaveAttribute("aria-expanded", "true");
    });

    it("collapses the panel when the trigger is clicked again", async () => {
      renderDisclosure({ defaultExpanded: true });
      const trigger = screen.getByRole("button", { name: /Account settings/ });
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("disabled state", () => {
    it("does not expand when disabled", async () => {
      renderDisclosure({ isDisabled: true });
      await userEvent.click(
        screen.getByRole("button", { name: /Account settings/ }),
      );
      expect(
        screen.getByRole("button", { name: /Account settings/ }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });
});

// ─── DisclosureGroup ──────────────────────────────────────────────────────────

describe("DisclosureGroup", () => {
  function renderGroup(groupProps = {}) {
    return render(
      <DisclosureGroup {...groupProps}>
        <Disclosure id="personal">
          <DisclosureHeader>Personal Information</DisclosureHeader>
          <DisclosurePanel>Personal information form here.</DisclosurePanel>
        </Disclosure>
        <Disclosure id="billing">
          <DisclosureHeader>Billing Address</DisclosureHeader>
          <DisclosurePanel>Billing address form here.</DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>,
    );
  }

  it("renders all disclosures in the group", () => {
    renderGroup();
    expect(
      screen.getByRole("button", { name: /Personal Information/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Billing Address/ }),
    ).toBeInTheDocument();
  });

  it("expands a disclosure when its trigger is clicked", async () => {
    renderGroup();
    await userEvent.click(
      screen.getByRole("button", { name: /Personal Information/ }),
    );
    expect(screen.getByText("Personal information form here.")).toBeVisible();
  });

  it("opens the correct disclosure from defaultExpandedKeys", () => {
    renderGroup({ defaultExpandedKeys: ["personal"] });
    expect(screen.getByText("Personal information form here.")).toBeVisible();
    expect(screen.queryByText("Billing address form here.")).not.toBeVisible();
  });

  it("closes the first disclosure when a second is opened (accordion mode)", async () => {
    renderGroup({ defaultExpandedKeys: ["personal"] });
    await userEvent.click(
      screen.getByRole("button", { name: /Billing Address/ }),
    );
    expect(
      screen.queryByText("Personal information form here."),
    ).not.toBeVisible();
    expect(screen.getByText("Billing address form here.")).toBeVisible();
  });

  it("allows multiple disclosures to be open when allowsMultipleExpanded is true", async () => {
    renderGroup({
      defaultExpandedKeys: ["personal"],
      allowsMultipleExpanded: true,
    });
    await userEvent.click(
      screen.getByRole("button", { name: /Billing Address/ }),
    );
    expect(screen.getByText("Personal information form here.")).toBeVisible();
    expect(screen.getByText("Billing address form here.")).toBeVisible();
  });
});
