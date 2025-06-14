import type { MarkdownProps } from "@react-email/components";
import type { CSSProperties } from "react";

type classNames =
  | "main"
  | "container"
  | "heading"
  | "subheading"
  | "link"
  | "hr"
  | "paragraph"
  | "button"
  | "footer"
  | "footerLogo"
  | "socialLink"
  | "disclaimer";

export const styles: Record<classNames, CSSProperties> = {
  main: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: "16px",
  },
  container: {
    margin: "0 auto",
    padding: "24px 0 16px",
    marginBottom: "64px",
  },
  heading: {
    fontSize: "44px",
    fontWeight: 700,
    lineHeight: "1",
    letterSpacing: "-0.03em",
    margin: "0 0 16px",
  },
  subheading: {
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "32px",
    letterSpacing: "-0.01em",
    margin: "0",
  },
  link: {
    color: "currentColor",
    textDecoration: "underline",
  },
  hr: {
    borderWidth: "2px",
    margin: "24px 0",
  },
  paragraph: {
    fontSize: "18px",
    lineHeight: "24px",
    marginBottom: "16px",
  },
  button: {
    backgroundColor: "#111111",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "18px",
    padding: "12px 20px",
    borderRadius: "4px",
    margin: "8px 0",
  },
  footer: {
    fontSize: "16px",
    lineHeight: "20px",
  },
  footerLogo: {
    width: "80%",
  },
  socialLink: {
    margin: "0 0 0 12px",
  },
  disclaimer: {
    fontSize: "14px",
    lineHeight: "18px",
  },
};

export const markdownCustomStyles: MarkdownProps["markdownCustomStyles"] = {
  p: styles.paragraph,
  link: styles.link,
  hr: styles.hr,
  h1: styles.heading,
  h2: styles.subheading,
};
