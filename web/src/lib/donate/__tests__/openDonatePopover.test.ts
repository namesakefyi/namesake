import { afterEach, describe, expect, it, vi } from "vitest";
import { type DonateOptions, siteInfo } from "#constants/site-info";

const everyOrg = {
  createWidget: vi.fn(),
  setOptions: vi.fn(),
  showWidget: vi.fn(),
};

const finishLoadingScript = (event: "load" | "error") =>
  document.head.querySelector("script")?.dispatchEvent(new Event(event));

const loadModule = async () => {
  vi.resetModules();
  return (await import("../openDonatePopover")).openDonatePopover;
};

const openWithEveryOrg = async (options?: DonateOptions) => {
  const openDonatePopover = await loadModule();
  const opened = openDonatePopover(options);
  window.everyDotOrgDonateButton = everyOrg;
  finishLoadingScript("load");
  await opened;
  return openDonatePopover;
};

describe("openDonatePopover", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    delete window.everyDotOrgDonateButton;
  });

  it("should load the Every.org script once and open the popover", async () => {
    const openDonatePopover = await openWithEveryOrg({
      amount: 25,
      frequency: "monthly",
    });
    await openDonatePopover();

    expect(document.head.querySelectorAll("script")).toHaveLength(1);
    expect(everyOrg.createWidget).toHaveBeenCalledOnce();
    expect(everyOrg.createWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        nonprofitSlug: siteInfo.donation.nonprofitSlug,
        addAmounts: siteInfo.donation.suggestedAmounts,
      }),
    );
    expect(everyOrg.setOptions).toHaveBeenNthCalledWith(1, {
      amount: 25,
      defaultFrequency: "monthly",
    });
    expect(everyOrg.setOptions).toHaveBeenNthCalledWith(2, {
      amount: undefined,
      defaultFrequency: "once",
    });
    expect(everyOrg.showWidget).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["the script fails to load", "error"],
    ["the Every.org API is missing", "load"],
  ] as const)("should reject when %s", async (_, event) => {
    const opened = (await loadModule())();
    finishLoadingScript(event);

    await expect(opened).rejects.toBeDefined();
  });
});
