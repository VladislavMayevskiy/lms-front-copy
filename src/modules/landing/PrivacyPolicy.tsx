import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const LAST_UPDATED = "February 25, 2026";

export default function PrivacyPolicy() {
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
              Privacy Policy
            </Heading>
            <Text fontFamily="Lato" fontSize="14px" color="#888">
              Last updated: {LAST_UPDATED}
            </Text>
          </Box>

          <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
            COURSA ("we", "our", or "us") is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, share, and safeguard data when you
            use our website and online learning platform (collectively, the "Service"). By using the
            Service you agree to the practices described below.
          </Text>

          {/* Section 1 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              1. What Data We Collect
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <strong>Account information:</strong> When you register, we collect your name,
                email address, password (hashed), and role (student, teacher, or administrator).
              </Text>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <strong>Profile data:</strong> Optional information you add to your profile, such
                as a profile photo, bio, or professional credentials.
              </Text>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <strong>Usage data:</strong> Pages visited, courses viewed, lessons completed,
                quiz results, and time spent on the platform.
              </Text>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <strong>Payment data:</strong> When you purchase a subscription we collect billing
                address and payment method details. Card numbers are processed and stored by our
                payment processor (Stripe) and are never stored on our servers.
              </Text>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <strong>Device &amp; log data:</strong> IP address, browser type, operating system,
                referring URLs, and error logs collected automatically.
              </Text>
            </VStack>
          </Box>

          {/* Section 2 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              2. How We Use Your Data
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                We use the information we collect to:
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}>Provide, operate, and improve the COURSA platform.</Box>
                <Box as="li" mb={2}>Personalise your learning experience and course recommendations.</Box>
                <Box as="li" mb={2}>Process payments and issue invoices.</Box>
                <Box as="li" mb={2}>Send transactional emails (account confirmation, password reset, purchase receipts).</Box>
                <Box as="li" mb={2}>Send optional product updates and newsletters (you may opt out at any time).</Box>
                <Box as="li" mb={2}>Analyse usage patterns to improve platform performance and content quality.</Box>
                <Box as="li" mb={2}>Comply with legal obligations and enforce our Terms &amp; Conditions.</Box>
              </Box>
            </VStack>
          </Box>

          {/* Section 3 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              3. Cookies
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                We use cookies and similar tracking technologies to maintain your session, remember
                your preferences, and analyse how you use the Service.
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}><strong>Essential cookies:</strong> Required for authentication and platform functionality. Cannot be disabled.</Box>
                <Box as="li" mb={2}><strong>Analytics cookies:</strong> Help us understand usage patterns. You may opt out via your browser settings or the Cookie Settings link in our footer.</Box>
                <Box as="li" mb={2}><strong>Marketing cookies:</strong> Used to deliver relevant advertisements. You can opt out at any time.</Box>
              </Box>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                Most browsers allow you to refuse cookies. Note that disabling essential cookies may
                affect the functionality of the Service.
              </Text>
            </VStack>
          </Box>

          {/* Section 4 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              4. Sharing with Third Parties
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                We do not sell your personal data. We may share it with:
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}><strong>Service providers:</strong> Hosting, analytics, payment processing (Stripe), and email delivery vendors who process data on our behalf under data processing agreements.</Box>
                <Box as="li" mb={2}><strong>Educational institutions:</strong> If you access COURSA through a school or district subscription, your progress data may be visible to that institution's administrators.</Box>
                <Box as="li" mb={2}><strong>Law enforcement:</strong> When required by applicable law, court order, or governmental authority.</Box>
                <Box as="li" mb={2}><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.</Box>
              </Box>
            </VStack>
          </Box>

          {/* Section 5 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              5. Data Retention
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              We retain your personal data for as long as your account is active or as needed to
              provide the Service. You may request deletion of your account at any time (see User
              Rights below). After deletion we may retain anonymised, aggregated data for analytical
              purposes. Backup copies may persist for up to 90 days following deletion.
            </Text>
          </Box>

          {/* Section 6 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              6. Security
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              We implement industry-standard technical and organisational measures to protect your
              data, including TLS encryption in transit, hashed password storage, role-based access
              controls, and regular security audits. No method of transmission over the internet is
              100% secure; we cannot guarantee absolute security.
            </Text>
          </Box>

          {/* Section 7 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              7. Your Rights
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                Depending on your location you may have the right to:
              </Text>
              <Box as="ul" pl={6} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                <Box as="li" mb={2}><strong>Access</strong> the personal data we hold about you.</Box>
                <Box as="li" mb={2}><strong>Correct</strong> inaccurate or incomplete data.</Box>
                <Box as="li" mb={2}><strong>Delete</strong> your account and associated personal data.</Box>
                <Box as="li" mb={2}><strong>Restrict</strong> or object to certain processing activities.</Box>
                <Box as="li" mb={2}><strong>Data portability</strong> – receive your data in a structured, machine-readable format.</Box>
                <Box as="li" mb={2}><strong>Withdraw consent</strong> at any time where processing is based on consent.</Box>
              </Box>
              <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
                To exercise any of these rights, contact us at the address below. We will respond
                within 30 days.
              </Text>
            </VStack>
          </Box>

          {/* Section 8 */}
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "24px" }} fontWeight="700" fontFamily="Lato" mb={3}>
              8. Contact Us
            </Heading>
            <Text fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              If you have any questions about this Privacy Policy or wish to exercise your rights,
              please contact our Data Protection team:
            </Text>
            <Box mt={3} fontFamily="Lato" fontSize="16px" color="#434645" lineHeight="1.8">
              <Text><strong>COURSA Inc.</strong></Text>
              <Text>Email: <Box as="a" href="mailto:privacy@coursa.com" color="#0070C1">privacy@coursa.com</Box></Text>
              <Text>Address: 123 Learning Lane, San Francisco, CA 94105, United States</Text>
            </Box>
          </Box>

        </VStack>
      </Box>

      <Footer />
    </Box>
  );
}
