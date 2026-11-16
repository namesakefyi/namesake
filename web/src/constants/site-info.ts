import { COLORS } from "#constants/colors";

export const DONATION_FREQUENCIES = ["once", "monthly"] as const;

export type DonationFrequency = (typeof DONATION_FREQUENCIES)[number];

export type DonateOptions = {
  amount?: number;
  frequency?: DonationFrequency;
};

export type SocialPlatform =
  | "bluesky"
  | "discord"
  | "email"
  | "github"
  | "instagram"
  | "linkedin"
  | "rss";

export type SocialLink = {
  name: string;
  text: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  fullName: string;
  title: string;
  description: string;
  fiscalSponsor: {
    name: string;
    url: string;
  };
  donation: {
    nonprofitSlug: string;
    suggestedAmounts: readonly number[];
    primaryColor: string;
    methods: readonly string[];
  };
  image: {
    src: string;
    alt: string;
  };
  urls: {
    directory: string;
    guides: string;
    forms: string;
    blog: string;
    chat: string;
    status: string;
    donate: string;
    contribute: string;
    start: string;
  };
  socialLinks: Record<SocialPlatform, SocialLink>;
  editGuideBaseUrl: string;
  historyBaseUrl: string;
};

export const siteInfo: SiteInfo = {
  name: "Namesake",
  fullName: "Namesake Collaborative",
  title: "Your name is yours to change",
  description:
    "Streamlining the legal name and gender marker change process in the US.",
  fiscalSponsor: {
    name: "Superbloom Design",
    url: "https://superbloom.design/",
  },
  donation: {
    nonprofitSlug: "namesake",
    suggestedAmounts: [10, 25, 50, 100],
    primaryColor: COLORS.black.hex,
    methods: ["card", "bank", "paypal", "venmo", "pay", "daf"],
  },
  urls: {
    directory: "/directory",
    guides: "/guides",
    forms: "/forms",
    blog: "/blog",
    chat: "/chat",
    status: "/status",
    donate: "/donate",
    contribute: "https://docs.namesake.fyi",
    start: "/guides/getting-started",
  },
  image: {
    src: "/og/social.png",
    alt: "Your name is yours to change",
  },
  socialLinks: {
    discord: {
      name: "Discord",
      text: "Join Namesake on Discord",
      href: "/chat",
    },
    github: {
      name: "GitHub",
      text: "Go to Namesake's GitHub repo",
      href: "https://github.com/namesakefyi",
    },
    instagram: {
      name: "Instagram",
      text: "Follow Namesake on Instagram",
      href: "https://www.instagram.com/namesake.fyi",
    },
    bluesky: {
      name: "Bluesky",
      text: "Follow Namesake on Bluesky",
      href: "https://bsky.app/profile/namesake.fyi",
    },
    linkedin: {
      name: "LinkedIn",
      text: "Connect with Namesake on LinkedIn",
      href: "https://www.linkedin.com/company/namesake-fyi",
    },
    email: {
      name: "Email",
      text: "Email Namesake",
      href: "mailto:hey@namesake.fyi",
    },
    rss: {
      name: "RSS",
      text: "Subscribe to Namesake's RSS feed",
      href: "/rss.xml",
    },
  },
  editGuideBaseUrl: "/edit/#/collections/guides/entries/",
  historyBaseUrl: "https://github.com/namesakefyi/namesake/commits/main/web/",
};
