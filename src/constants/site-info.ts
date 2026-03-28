import {
  type RemixiconComponentType,
  RiBlueskyFill,
  RiDiscordFill,
  RiGithubFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiMailSendFill,
  RiRssFill,
} from "@remixicon/react";

type SocialPlatform =
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
  Icon: RemixiconComponentType;
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
  };
  socialLinks: Record<SocialPlatform, SocialLink>;
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
  urls: {
    directory: "/directory",
    guides: "/guides",
    forms: "/forms",
    blog: "/blog",
    chat: "/chat",
    status: "/status",
    donate:
      "https://www.every.org/namesake?suggestedAmounts=20%2C40%2C100%2C250&theme_color=6E56CF&method=card%2Cbank%2Cpaypal%2Cvenmo%2Cpay%2Cdaf&utm_campaign=donate-link#/donate",
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
      Icon: RiDiscordFill,
    },
    github: {
      name: "GitHub",
      text: "Go to Namesake's GitHub repo",
      href: "https://github.com/namesakefyi",
      Icon: RiGithubFill,
    },
    instagram: {
      name: "Instagram",
      text: "Follow Namesake on Instagram",
      href: "https://www.instagram.com/namesake.fyi",
      Icon: RiInstagramFill,
    },
    bluesky: {
      name: "Bluesky",
      text: "Follow Namesake on Bluesky",
      href: "https://bsky.app/profile/namesake.fyi",
      Icon: RiBlueskyFill,
    },
    linkedin: {
      name: "LinkedIn",
      text: "Connect with Namesake on LinkedIn",
      href: "https://www.linkedin.com/company/namesake-fyi",
      Icon: RiLinkedinBoxFill,
    },
    email: {
      name: "Email",
      text: "Email Namesake",
      href: "mailto:hey@namesake.fyi",
      Icon: RiMailSendFill,
    },
    rss: {
      name: "RSS",
      text: "Subscribe to Namesake's RSS feed",
      href: "/rss.xml",
      Icon: RiRssFill,
    },
  },
};
