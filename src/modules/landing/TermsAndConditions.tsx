import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LAST_UPDATED = "February 25, 2026";

export default function TermsAndConditions() {
  return (
    <Box
      width="100%"
      minH="100vh"
      position="relative"
      sx={{ overflowX: "clip", "*, *::before, *::after": { boxSizing: "border-box" } }}
    >
      <Header />

      <Box
        maxW="1440px"
        mx="auto"
        px={{ base: "24px", md: "80px" }}
        py={{ base: "40px", md: "64px" }}
      >
        <VStack align="stretch" spacing={{ base: "32px", md: "40px" }}>

          {/* Page title */}
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: "32px", md: "48px" }}
              fontWeight="700"
              fontFamily="Lato"
              color="#114FF0"
              mb={2}
            >
              Terms &amp; Conditions
            </Heading>
            <Text fontFamily="Lato" fontSize="14px" color="#888">
              Last updated: {LAST_UPDATED}
            </Text>
          </Box>

          <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
            Please read these Terms &amp; Conditions ("Terms") carefully before using COURSA (the
            "Service") operated by COURSA Inc. ("we", "us", or "our"). By accessing or using the
            Service you agree to be bound by these Terms. If you disagree with any part of these
            Terms, you may not use the Service.
          </Text>

          {/* Section 1 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              1. Acceptance of Terms
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              By creating an account or using any part of the Service, you confirm that you are at
              least 13 years of age (or the minimum age required in your jurisdiction), that you
              have read and understood these Terms, and that you agree to be bound by them. If you
              are accepting on behalf of a company or other legal entity, you represent that you
              have the authority to bind that entity.
            </Text>
          </Box>

          {/* Section 2 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              2. Accounts
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                To access most features you must register for an account. You agree to:
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}>Provide accurate, current, and complete information during registration.</Box>
                <Box as="li" mb={2}>Maintain and promptly update your account information.</Box>
                <Box as="li" mb={2}>Keep your password confidential and not share it with others.</Box>
                <Box as="li" mb={2}>Notify us immediately of any unauthorised use of your account.</Box>
              </Box>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                You are responsible for all activity that occurs under your account. We reserve the
                right to suspend or terminate accounts that violate these Terms.
              </Text>
            </VStack>
          </Box>

          {/* Section 3 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              3. Purchases &amp; Subscriptions
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                Some features of COURSA require a paid subscription or one-time purchase.
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}><strong>Billing:</strong> Subscription fees are billed in advance on a monthly or annual basis. All amounts are in USD unless stated otherwise.</Box>
                <Box as="li" mb={2}><strong>Renewals:</strong> Subscriptions automatically renew at the end of each billing cycle unless cancelled before the renewal date.</Box>
                <Box as="li" mb={2}><strong>Cancellations:</strong> You may cancel your subscription at any time through your account settings. Access continues until the end of the current billing period.</Box>
                <Box as="li" mb={2}><strong>Refunds:</strong> Payments are non-refundable except where required by applicable law or at our sole discretion.</Box>
                <Box as="li" mb={2}><strong>Price changes:</strong> We may change subscription fees with 30 days' advance notice. Continued use after the change constitutes acceptance of the new price.</Box>
              </Box>
            </VStack>
          </Box>

          {/* Section 4 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              4. Permitted Use &amp; Prohibited Conduct
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                You may use the Service for lawful, personal, non-commercial educational purposes
                unless you hold a valid commercial licence. You must not:
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}>Copy, redistribute, or resell any course content without written permission.</Box>
                <Box as="li" mb={2}>Use the Service to transmit spam, malware, or any illegal content.</Box>
                <Box as="li" mb={2}>Attempt to gain unauthorised access to any part of the Service or its related systems.</Box>
                <Box as="li" mb={2}>Impersonate another person or misrepresent your affiliation with any entity.</Box>
                <Box as="li" mb={2}>Interfere with or disrupt the integrity or performance of the Service.</Box>
                <Box as="li" mb={2}>Use automated tools (bots, scrapers) to extract data from the platform without our prior written consent.</Box>
              </Box>
            </VStack>
          </Box>

          {/* Section 5 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              5. Intellectual Property
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              All content on the COURSA platform — including but not limited to course materials,
              videos, text, graphics, logos, and software — is the property of COURSA Inc. or its
              content licensors and is protected by copyright, trademark, and other intellectual
              property laws. You are granted a limited, non-exclusive, non-transferable licence to
              access and use the content for personal educational purposes only. Nothing in these
              Terms transfers any ownership rights to you.
            </Text>
          </Box>

          {/* Section 6 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              6. Termination
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              We may suspend or terminate your account and access to the Service at any time, with
              or without notice, for conduct that we believe violates these Terms or is harmful to
              other users, us, third parties, or for any other reason at our sole discretion. Upon
              termination, your right to use the Service will immediately cease. If you wish to
              terminate your account, you may do so through your account settings or by contacting
              us.
            </Text>
          </Box>

          {/* Section 7 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              7. Disclaimers
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF
              ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
              WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR
              OTHER HARMFUL COMPONENTS. COURSA DOES NOT GUARANTEE ANY SPECIFIC LEARNING OUTCOMES
              OR RESULTS FROM THE USE OF ITS PLATFORM.
            </Text>
          </Box>

          {/* Section 8 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              8. Limitation of Liability
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, COURSA INC. AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE,
              OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE. IN NO
              EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO COURSA IN THE
              12 MONTHS PRECEDING THE CLAIM, OR USD 100, WHICHEVER IS GREATER.
            </Text>
          </Box>

          {/* Section 9 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              9. Governing Law
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of California, United States, without regard to its conflict-of-law provisions.
              Any dispute arising under these Terms shall be resolved exclusively in the state or
              federal courts located in San Francisco County, California, and you consent to
              personal jurisdiction in those courts.
            </Text>
          </Box>

          {/* Section 10 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              10. Contact Us
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              If you have any questions about these Terms &amp; Conditions, please contact us:
            </Text>
            <Box mt={3} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              <Text><strong>COURSA Inc.</strong></Text>
              <Text>Email: <Box as="a" href="mailto:legal@coursa.com" color="#0070C1">legal@coursa.com</Box></Text>
              <Text>Address: 123 Learning Lane, San Francisco, CA 94105, United States</Text>
            </Box>
          </Box>

        </VStack>
      </Box>

      <Footer />
    </Box>
  );
}
