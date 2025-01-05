import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
  resetPasswordLink = "https://adresa.com/reset-password",
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Please reset your password.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi </Text>
        <Text style={paragraph}>
          Please click the link below to reset your password:
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetPasswordLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Your Company Address</Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  cursor: "pointer",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
