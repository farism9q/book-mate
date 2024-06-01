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
  Markdown,
} from "@react-email/components";
import * as React from "react";

interface Props {
  bookImageUrl: string;
  bookTitle: string;
  bookText: string;
  friendName: string;
  question?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const BookEmailTemplate = ({
  bookTitle,
  bookImageUrl,
  bookText,
  friendName,
  question,
}: Props) => (
  <Html>
    <Head />
    <Preview>Friend sent you highlight from a book!</Preview>
    <Body
      style={{
        backgroundColor: "#f3f3f5",
        fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
      }}
    >
      <Container
        style={{
          width: "620px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
        }}
      >
        <Section
          style={{
            borderRadius: "5px 5px 0 0",
            backgroundColor: "#e00707",
          }}
        >
          <Img
            width={620}
            style={{
              height: "400px",
              minWidth: "100%",
            }}
            src={bookImageUrl}
          />
        </Section>

        <Section
          style={{
            padding: "30px 30px 40px 30px",
          }}
        >
          <Heading
            as="h2"
            style={{
              fontSize: "36px",
              textAlign: "center",
            }}
          >
            {bookTitle}
          </Heading>

          <Heading
            as="h2"
            style={{
              fontSize: "21px",
              textAlign: "center",
              color: "#3c3f44",
            }}
          >
            {`This is what "${friendName}" from `}
            <Link href={baseUrl} style={{ color: "#e00707" }}>
              Book Mate
            </Link>
            {`
            sent to you`}
          </Heading>

          <Hr
            style={{
              margin: "30px 0",
            }}
          />
          <Section
            style={{
              position: "relative",
            }}
          >
            {question && (
              <Text
                style={{
                  position: "absolute",
                  top: "-20px",
                  fontSize: "25px",

                  borderRadius: "5px 5px 0px 0px",
                  backgroundColor: "#e00707",
                  padding: "5px 10px",
                  color: "#ffffff",
                }}
              >
                Question: {question}
              </Text>
            )}
            <Section>
              <Text
                style={{
                  padding: "20px",
                  fontSize: "20px",
                  lineHeight: "26px",
                  color: "#3c3f44",
                  backgroundColor: "#f3f3f5",
                  borderRadius: "0px 5px 5px 5px",
                }}
              >
                <Markdown>{bookText}</Markdown>
              </Text>
            </Section>
          </Section>

          <Hr
            style={{
              margin: "30px 0",
            }}
          />
        </Section>

        <Section
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "0px 200px",
            marginBottom: "10px",
          }}
        >
          <Text
            style={{
              textAlign: "center",

              fontSize: "12px",
              lineHeight: "21px",
              color: "#3c3f44",
              marginBottom: "20px",
            }}
          >
            This email was sent to you by Book Mate.
          </Text>

          <Link
            href={baseUrl}
            style={{
              textAlign: "center",

              backgroundColor: "#e00707",
              color: "#ffffff",
              border: "0",
              fontSize: "15px",
              lineHeight: "18px",
              cursor: "pointer",
              borderRadius: "4px",
              padding: "12px 30px",
            }}
          >
            Visit Book Mate
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BookEmailTemplate;
