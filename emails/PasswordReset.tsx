import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PasswordResetProps {
  resetCode?: string;
}

export const PasswordReset = ({ resetCode }: PasswordResetProps) => (
  <Html>
    <Head />
    <Preview>Your password reset code is {resetCode ?? "within"}</Preview>
    <Tailwind>
      <Body className="bg-white font-sans text-[#111111]">
        <Container className="my-[40px] px-[16px] mx-auto max-w-[452px]">
          <Heading className="text-[32px] font-bold mt-0">
            Reset your password
          </Heading>
          <Text className="text-[#333333]">Your password reset code is:</Text>
          <code className="block p-[20px] text-center text-[24px] max-w-[420px] bg-[#f4f4f4] rounded-lg text-[#333333]">
            {resetCode}
          </code>
          <Text className="text-[#666666]">
            If you didn&apos;t want to change your password or didn&apos;t
            request this, just ignore and delete this message.
          </Text>
          <Hr />
          <Img
            src="/static/namesake-logo.png"
            width="120"
            height="24"
            alt="Namesake Logo"
            className="mt-6"
          />
          <Section className="mt-4 text-[14px] text-[#999999]">
            <Link
              className="text-[#666666] underline"
              href="https://namesake.fyi"
            >
              namesake.fyi
            </Link>
            &nbsp;&nbsp;T4T
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

PasswordReset.PreviewProps = {
  resetCode: "sparo-ndigo-amurt-secan",
} as PasswordResetProps;

export default PasswordReset;
