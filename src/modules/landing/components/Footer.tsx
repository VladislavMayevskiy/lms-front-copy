import { Box, Flex, Text, HStack, VStack, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Facebook from "assets/imgs/landing/Facebook.svg?react";
import Inst from "assets/imgs/landing/Instagram.svg?react";
import X from "assets/imgs/landing/X.svg?react";
import LinkedIn from "assets/imgs/landing/LinkedIn.svg?react";
import Yt from "assets/imgs/landing/Youtube.svg?react";
import LogoWhite from "components/ui/logo/white";
import { AuthRoutes } from "constants/routes";

export default function Footer() {
  return (
    <Box px="16px" pb="4" width="100%" maxW="100vw">
      <Box 
        className="footer-poppins" 
        w="full" 
        gap="32px" 
        bgColor="#114FF0" 
        borderRadius="20px" 
        px={{ md: "80px", base: "24px" }} 
        py={{ md: "64px", base: "32px" }} 
        position="relative" 
        display="flex" 
        flexDirection="column" 
        justifyContent="space-between" 
        mx="auto"
        maxW="100%"
        overflow="hidden"
      >
        
        <Flex 
          justify="space-between" 
          align="center" 
          mt={7} 
          display={{ md: "flex", base: "none" }}
          flexWrap="wrap"
          gap="20px"
        >
          <Box flexShrink={0}>
            <LogoWhite/>
          </Box>
          <HStack gap="12px" flexShrink={0}>
            <Facebook style={{ cursor: 'pointer' }} />
            <Inst style={{ cursor: 'pointer' }} />
            <X style={{ cursor: 'pointer' }} />
            <LinkedIn style={{ cursor: 'pointer' }} />
            <Yt style={{ cursor: 'pointer' }} />
          </HStack>
        </Flex>

        <Box 
          bg="white" 
          height="1px" 
          width={{ base: "287px", md: "100%" }} 
          display={{ base: "none", md: "block" }}
        />

        <Flex justify="center">
          <HStack 
            gap="30px" 
            fontSize="14px" 
            lineHeight="150%" 
            display={{ md: "flex", base: "none" }}
            flexWrap="wrap"
            justify="center"
          >
            <Link
              as={RouterLink}
              to={AuthRoutes.privacyPolicy}
              textDecoration="underline"
              color="white"
              _hover={{ opacity: 0.8 }}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              as={RouterLink}
              to={AuthRoutes.termsAndConditions}
              textDecoration="underline"
              color="white"
              _hover={{ opacity: 0.8 }}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Terms of Service
            </Link>
            <Text 
              textDecoration="underline" 
              color="white" 
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              Cookies Settings
            </Text>
          </HStack>
        </Flex>

        <VStack gap="30px" display={{ base: "flex", md: "none" }} align="center" width="100%">
          <Flex justify="space-between" align="center" width="100%">
              <LogoWhite/>
            <HStack gap="8px" flexShrink={0}>
              <Facebook style={{ cursor: 'pointer' }} />
              <Inst style={{ cursor: 'pointer' }} />
              <X style={{ cursor: 'pointer' }} />
              <LinkedIn style={{ cursor: 'pointer' }} />
              <Yt style={{ cursor: 'pointer' }} />
            </HStack>
          </Flex>

          <Box bg="white" height="1px" width="100%" />

          <VStack gap="10px" fontSize="14px" lineHeight="150%" textAlign="center" width="100%">
            <Link
              as={RouterLink}
              to={AuthRoutes.privacyPolicy}
              textDecoration="underline"
              color="white"
              _hover={{ opacity: 0.8 }}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              as={RouterLink}
              to={AuthRoutes.termsAndConditions}
              textDecoration="underline"
              color="white"
              _hover={{ opacity: 0.8 }}
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Terms of Service
            </Link>
            <Text 
              textDecoration="underline" 
              color="white" 
              cursor="pointer"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              Cookies Settings
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
