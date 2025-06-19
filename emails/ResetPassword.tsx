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

export function ResetPasswordEmail({
  email,
  url,
}: { email: string; url: string }) {
  return (
    <Html>
      <Head>
        <title>Reset your password</title>
      </Head>
      <Body style={styles.main}>
        <Preview>We got a request to reset your password.</Preview>
        <Container style={styles.container} className="container">
          <Heading style={styles.heading}>Reset your password</Heading>
          <Text style={styles.paragraph}>
            We got a request to reset the password for the Namesake account
            associated with {email ?? "this email address"}.
          </Text>
          <Text style={styles.paragraph}>
            Reset your password by clicking the link below:
          </Text>
          <Button href={url} style={styles.button}>
            Reset your password
          </Button>
          <Text style={styles.paragraph}>
            If you didn’t request a new password, please let us know by replying
            to this email.
          </Text>
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

export default ResetPasswordEmail;
