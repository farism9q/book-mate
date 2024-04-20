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
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  bookImageUrl: string;
  bookTitle: string;
  bookText: string;
  friendName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const BookEmailTemplate = ({
  bookTitle,
  bookImageUrl,
  bookText,
  friendName,
}: Props) => (
  <Html>
    <Head />
    <Preview>Stack overflow tips for searching</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logo}></Section>

        <Section style={header}>
          <Img style={headerImage} src={bookImageUrl} />
        </Section>

        <Section style={content}>
          <Heading as="h2" style={title}>
            {bookTitle}
          </Heading>

          <Hr style={divider} />

          <Heading as="h2" style={title}>
            {`This is what "${friendName}" from Book Mate sent to you`}
          </Heading>
          <Text style={paragraph}>{bookText}</Text>

          <Hr style={divider} />
        </Section>

        <Section style={footer}>
          <Text>This email was sent to you by Book Mate.</Text>

          <Link href={baseUrl} style={linkButton}>
            Visit Book Mate
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BookEmailTemplate;

const main = {
  backgroundColor: "#f3f3f5",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const headerImage = {
  height: "400px",
  width: "100%",
};

const title = {
  margin: "0 0 15px",
  fontWeight: "bold",
  fontSize: "21px",
  lineHeight: "21px",
  color: "#0c0d0e",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "21px",
  color: "#3c3f44",
};

const divider = {
  margin: "30px 0",
};

const container = {
  width: "680px",
  maxWidth: "100%",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const content = {
  padding: "30px 30px 40px 30px",
};

const logo = {
  display: "flex",
  background: "#f3f3f5",
  padding: "20px 30px",
};

const header = {
  borderRadius: "5px 5px 0 0",
  backgroundColor: "#2b2d6e",
};

const footer = {
  marginTop: "40px",
  marginBottom: "24px",
  textAlign: "center" as const,
  padding: "35px 20px 30px 20px",
};
const linkButton = {
  background: "#b67814",
  color: "#ffffff",
  border: "0",
  fontSize: "15px",
  lineHeight: "18px",
  cursor: "pointer",
  borderRadius: "4px",
  padding: "12px",
};
