import * as React from "react"
import {
  Body,
  Head,
  Heading,
  Html,
  Link,
  Row,
  Text,
} from "@react-email/components"
import { Button } from "@/components/ui/button"

interface Props {
  username: string;
  verificationCode: string;
}

export function VerificationEmailTemplate({ username, verificationCode }: Props) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Account verification email</title>
      </Head>

      <Body>
        <Row>
          <Heading as="h2">Here&apos;s your verification otp</Heading>
          <Heading as="h1">{verificationCode}</Heading>
        </Row>

        <Row>
          <Heading as="h2">Helo {username}</Heading>
          <Text>
            Thank you for registering, please use following otp to complete your
            registration.
          </Text>
          <Text>Make sure don&apos;t share your otp to anyone! OTP expried in 10m</Text>
        </Row>

        <Row>
          <Link href={`${process.env.DOMAIN}/verify-account?q=${username}`}>
            <Button>Verify</Button>
          </Link>
        </Row>
      </Body>
    </Html>
  )
}
