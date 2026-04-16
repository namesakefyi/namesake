import {
  RiGlobalLine,
  RiMailSendLine,
  RiMapPinLine,
  RiPhoneLine,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import { SERVICE_LABELS, type Service } from "../../../constants/services";
import { urlForImage } from "../../../sanity/lib/urlForImage";
import type { DIRECTORY_CONTACTS_LIST_QUERY_RESULT } from "../../../sanity/sanity.types";
import { formatCleanUrl } from "../../../utils/formatCleanUrl";
import styles from "./DirectoryList.module.css";

export function DirectoryListItem({
  name,
  description,
  states,
  services,
  email,
  phone,
  url,
  logo,
  officialPartner,
}: DIRECTORY_CONTACTS_LIST_QUERY_RESULT[number]) {
  const contactLinks = [
    { Icon: RiGlobalLine, href: url, label: formatCleanUrl(url) },
    { Icon: RiMailSendLine, href: `mailto:${email}`, label: email },
    { Icon: RiPhoneLine, href: `tel:${phone}`, label: phone },
  ].filter((link) => link.label);

  const logoSrc =
    logo?.asset &&
    urlForImage(logo.asset)
      .withOptions({ height: 64 })
      .auto("format")
      .dpr(2)
      .url();

  return (
    <li className={styles.directoryListItem}>
      {logoSrc ? (
        <img className={styles.logo} src={logoSrc} alt={`${name} logo`} />
      ) : null}
      <header>
        {officialPartner ? (
          <div className={styles.badge}>
            <RiVerifiedBadgeFill />
            Namesake Partner
          </div>
        ) : null}
        <h2>{name}</h2>
        <p className={styles.description}>{description}</p>
      </header>
      <ul className={styles.services} aria-label="Services">
        {services.map((service) => (
          <li key={service}>{SERVICE_LABELS[service as Service] ?? service}</li>
        ))}
      </ul>
      <ul className={styles.contactInfo}>
        <li>
          <RiMapPinLine />
          <div className={styles.contactLabel}>
            <span>{states?.join(", ")}</span>
          </div>
        </li>
        {contactLinks.map(({ Icon, href, label }) => (
          <li key={href}>
            <Icon />
            <div className={styles.contactLabel}>
              <a href={href}>{label}</a>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}
