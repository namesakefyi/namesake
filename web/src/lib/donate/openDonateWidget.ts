import {
  type DonateOptions,
  type DonationFrequency,
  donation,
} from "#constants/donation";

const WIDGET_SCRIPT_URL = "https://embeds.every.org/0.4/button.js?explicit=1";

type WidgetOptions = {
  amount?: number;
  defaultFrequency?: DonationFrequency;
};

declare global {
  interface Window {
    everyDotOrgDonateButton?: {
      createWidget: (
        options: {
          element: HTMLElement;
          nonprofitSlug: string;
          addAmounts: readonly number[];
          primaryColor: string;
          methods: readonly string[];
        } & WidgetOptions,
      ) => void;
      setOptions: (options: WidgetOptions) => void;
      showWidget: () => void;
    };
  }
}

let widgetReady: Promise<NonNullable<Window["everyDotOrgDonateButton"]>>;

const loadWidget = () => {
  widgetReady ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_URL;
    script.async = true;
    script.onerror = reject;
    script.onload = () => {
      const widget = window.everyDotOrgDonateButton;
      if (!widget) return reject(new Error("Every.org widget missing"));

      // The widget requires an element to bind its own click handler to;
      // a detached one keeps it from intercepting clicks on the page.
      widget.createWidget({
        element: document.createElement("button"),
        nonprofitSlug: donation.nonprofitSlug,
        addAmounts: donation.suggestedAmounts,
        primaryColor: donation.primaryColor,
        methods: donation.methods,
      });
      resolve(widget);
    };
    document.head.appendChild(script);
  });

  return widgetReady;
};

export const openDonateWidget = async ({
  amount,
  frequency,
}: DonateOptions = {}) => {
  const widget = await loadWidget();
  widget.setOptions({
    amount,
    defaultFrequency: frequency ?? "once",
  });
  widget.showWidget();
};
