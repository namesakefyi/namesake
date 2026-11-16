import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteInfo } from "#constants/site-info";

const { donation } = siteInfo;

const loadModule = async () => {
  vi.resetModules();
  return import("../openDonatePopover");
};

const createEveryOrgMock = () => ({
  createWidget: vi.fn(),
  setOptions: vi.fn(),
  showWidget: vi.fn(),
});

const finishLoadingScript = (event: "load" | "error") => {
  const script = document.head.querySelector<HTMLScriptElement>(
    'script[src^="https://embeds.every.org/"]',
  );
  if (event === "load") script?.onload?.(new Event("load"));
  else script?.onerror?.(new Event("error"));
};

describe("openDonatePopover", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  afterEach(() => {
    delete window.everyDotOrgDonateButton;
  });

  it("should load the Every.org script and open the popover", async () => {
    const everyOrg = createEveryOrgMock();
    const { openDonatePopover } = await loadModule();

    const opened = openDonatePopover({ amount: 25, frequency: "monthly" });
    window.everyDotOrgDonateButton = everyOrg;
    finishLoadingScript("load");
    await opened;

    expect(everyOrg.createWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        element: expect.any(HTMLButtonElement),
        nonprofitSlug: donation.nonprofitSlug,
        addAmounts: donation.suggestedAmounts,
        primaryColor: donation.primaryColor,
        methods: donation.methods,
      }),
    );
    expect(everyOrg.setOptions).toHaveBeenCalledWith({
      amount: 25,
      defaultFrequency: "monthly",
    });
    expect(everyOrg.showWidget).toHaveBeenCalledOnce();
  });

  it("should load the script only once across opens", async () => {
    const everyOrg = createEveryOrgMock();
    const { openDonatePopover } = await loadModule();

    const firstOpen = openDonatePopover();
    window.everyDotOrgDonateButton = everyOrg;
    finishLoadingScript("load");
    await firstOpen;
    await openDonatePopover({ amount: 50 });

    expect(document.head.querySelectorAll("script")).toHaveLength(1);
    expect(everyOrg.createWidget).toHaveBeenCalledOnce();
    expect(everyOrg.setOptions).toHaveBeenLastCalledWith({
      amount: 50,
      defaultFrequency: "once",
    });
    expect(everyOrg.showWidget).toHaveBeenCalledTimes(2);
  });

  it("should reset to a one-time donation with no amount by default", async () => {
    const everyOrg = createEveryOrgMock();
    const { openDonatePopover } = await loadModule();

    const opened = openDonatePopover();
    window.everyDotOrgDonateButton = everyOrg;
    finishLoadingScript("load");
    await opened;

    expect(everyOrg.setOptions).toHaveBeenCalledWith({
      amount: undefined,
      defaultFrequency: "once",
    });
  });

  it("should reject when the script fails to load", async () => {
    const { openDonatePopover } = await loadModule();

    const opened = openDonatePopover();
    finishLoadingScript("error");

    await expect(opened).rejects.toBeDefined();
  });

  it("should reject when the script loads without the Every.org API", async () => {
    const { openDonatePopover } = await loadModule();

    const opened = openDonatePopover();
    finishLoadingScript("load");

    await expect(opened).rejects.toThrow("Every.org popover missing");
  });
});
