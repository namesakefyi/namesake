import { type DonateOptions, siteInfo } from "#constants/site-info";

const { donation } = siteInfo;

const POPOVER_SCRIPT_URL = "https://embeds.every.org/0.4/button.js?explicit=1";

declare global {
  interface Window {
    everyDotOrgDonateButton?: {
      createWidget: (options: object) => void;
      setOptions: (options: object) => void;
      showWidget: () => void;
    };
  }
}

let popoverReady: Promise<NonNullable<Window["everyDotOrgDonateButton"]>>;

const loadPopover = () => {
  popoverReady ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = POPOVER_SCRIPT_URL;
    script.onerror = reject;
    script.onload = () => {
      const popover = window.everyDotOrgDonateButton;
      if (!popover) return reject(new Error("Every.org popover missing"));

      // Every.org requires an element to bind its own click handler to;
      // a detached one keeps it from intercepting clicks on the page.
      popover.createWidget({
        element: document.createElement("button"),
        nonprofitSlug: donation.nonprofitSlug,
        addAmounts: donation.suggestedAmounts,
        primaryColor: donation.primaryColor,
        methods: donation.methods,
      });
      resolve(popover);
    };
    document.head.appendChild(script);
  });

  return popoverReady;
};

export const openDonatePopover = async ({
  amount,
  frequency,
}: DonateOptions = {}) => {
  const popover = await loadPopover();
  popover.setOptions({ amount, defaultFrequency: frequency ?? "once" });
  popover.showWidget();
};
