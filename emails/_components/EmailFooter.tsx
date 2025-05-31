import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { baseUrl } from "../constants";
import { styles } from "../styles";

export const EmailFooter = () => {
  return (
    <>
      <Hr style={styles.hr} />
      <Section style={styles.footer}>
        <Row>
          <Column style={styles.footerLogo}>
            <Img
              alt="Namesake logo"
              height="24"
              src={`${baseUrl}/namesake-logo.png`}
            />
          </Column>
          <Column align="right">
            <Row align="right">
              <Column>
                <Link href="https://namesake.fyi/chat">
                  <Img
                    alt="Discord"
                    style={styles.socialLink}
                    height="36"
                    src={`${baseUrl}/discord-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://github.com/namesakefyi">
                  <Img
                    alt="GitHub"
                    style={styles.socialLink}
                    height="36"
                    src={`${baseUrl}/github-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="https://bsky.app/profile/namesake.fyi">
                  <Img
                    alt="Bluesky"
                    style={styles.socialLink}
                    height="36"
                    src={`${baseUrl}/bluesky-logo.png`}
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>
      <Text style={styles.disclaimer}>
        T4T&emsp;
        <Link href="mailto:hey@namesake.fyi" style={styles.link}>
          hey@namesake.fyi
        </Link>
        &emsp;
        <Link
          href="https://namesake.fyi/terms/#legal-disclaimer"
          style={styles.link}
        >
          We’re not lawyers.
        </Link>
      </Text>
    </>
  );
};
