import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { EmailFooter } from "./_components";
import { styles } from "./styles";

export function DeleteAccountEmail({
  email,
  url,
}: { email: string; url: string }) {
  return (
    <Html>
      <Head>
        <title>Confirm account deletion</title>
      </Head>
      <Body style={styles.main}>
        <Preview>We got a request to delete your Namesake account.</Preview>
        <Container style={styles.container} className="container">
          <Heading style={styles.heading}>Confirm account deletion</Heading>
          <Text style={styles.paragraph}>
            We got a request to delete the Namesake account associated with{" "}
            {email ?? "this email address"}. We hope we’ve been able to help you
            with the name change process.
          </Text>
          <Text style={styles.paragraph}>
            Permanently delete your account by clicking the link below.
          </Text>
          <Button href={url} style={styles.button}>
            Permanently delete account
          </Button>
          <Text style={styles.paragraph}>
            If you didn't request this, please let us know by replying to this
            email.
          </Text>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

export default DeleteAccountEmail;
