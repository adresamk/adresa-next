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

interface VerifyUserEmailProps {
  userName: string;
  verificationLink: string;
}

export const VerifyUserEmail = ({
  userName = "John Doe",
  verificationLink = "https://adresa.com/verify",
}: VerifyUserEmailProps) => (
  <Html>
    <Head />
    <Preview>Please verify your email address.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          Please click the link below to verify your email address:
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={verificationLink}>
            Verify Email
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

export default VerifyUserEmail;

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
