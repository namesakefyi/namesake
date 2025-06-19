import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { EmailFooter } from "./_components";
import { styles } from "./styles";

export function WelcomeEmail() {
  return (
    <Html>
      <Head>
        <title>Welcome to Namesake</title>
      </Head>
      <Body style={styles.main}>
        <Preview>We’re glad you are here. :)</Preview>
        <Container style={styles.container} className="container">
          <Heading style={styles.heading}>Welcome to Namesake!</Heading>
          <Text style={styles.subheading}>We’re glad you are here. :)</Text>
          <Hr style={styles.hr} />
          <Text style={styles.paragraph}>
            Here's what the process looks like... TBD
          </Text>
          <Button href="https://namesake.fyi/chat" style={styles.button}>
            Chat on Discord
          </Button>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
