import {
  Box,
  Heading,
  Button,
  Flex,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";
import Background from "assets/imgs/landing/Background.svg?react";
import DownIcon from "assets/imgs/landing/Down.svg?react";
import GreenTriangle from "assets/imgs/landing/GreenTriangle.svg?react";
import BlueSquare from "assets/imgs/landing/BlueSquare.svg?react";
import OrangeCircle from "assets/imgs/landing/OrangeCircle.svg?react";
import RedStar from "assets/imgs/landing/RedStar.svg?react";

export default function Section3() {
  const items = [
    { Icon: GreenTriangle, title: "Your Brand, Your Way", text: "Offer schools a platform that carries your name, logo, and identity." },
    { Icon: OrangeCircle, title: "Monetise with Ease", text: "Sell courses directly to schools with built-in e-commerce and licensing tools." },
    { Icon: BlueSquare, title: "Scalable & Secure", text: "Handle any number of schools, classes, and learners with enterprise-grade security." },
    { Icon: RedStar, title: "All-in-One Solution", text: "No need for external tools: host, deliver, manage, and sell in one platform." },
  ];

  return (
    <Box w="100%" mt={{ base: "87px", md: -4 }} overflowX="clip">
      <Container maxW="1440px" px={{ base: 0, md: 0 }} w={'100%'}>
        <Flex
          w="100%"
          direction={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "flex-start" }}
          gap={{ base: 6, md: "42px" }}
          py={{ base: 0, md: 4 }}
          px={{ base: 5, md: 0 }} 
        >
          <Box
            position="relative"
            w={{ base: "100%", md: "702px" }}
            maxW={{ md: "702px" }} 
            mx={{ base: "auto", md: 0 }}
            borderRadius={{ base: "12px", md: 0 }}
            overflow="hidden"
            px={{ base: 6, md: 6 }}
            py={{ base: 8, md: 6 }}
            display="flex"

            alignItems={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            minH={{ base: "120px", md: "1060px" }}
          >
            <Box position="absolute" inset={0} zIndex={-1} w={'100%'} minW={'320px'}>
              <Background preserveAspectRatio="none" width="100%" height="100%" />
            </Box>

            <Heading
              w="100%"
              color="white"
              fontSize={{ base: "28px", md: "32px" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Key Benefits
            </Heading>

            <Box mt="auto" display={{ base: "none", md: "block" }}>
              <Box
                p="8px"
                border="1px dashed #5A88FF"
                borderRadius="14px"
                w="178px"
                display="flex"
                justifyContent="center"
              >
                <Button
                  bgColor="white"
                  _hover={{ bgColor: "white" }}
                  fontWeight={400}
                  color="#114FF0"
                  borderRadius="12px"
                  fontSize="16px"
                  w="154px"
                  h="48px"
                  rightIcon={<DownIcon />}
                  onClick={() => {
                    document.getElementById("contact-us-section")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                >
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Box>

          <VStack
            w={{ base: "100%", md: "662px" }}
            maxW={{ base: "100%", md: "662px" }}
            mx={{ base: "auto", md: 0 }}
            align={{ base: "center", md: "flex-start" }}
            spacing={4}
            mt={{ base: 0, md: 1 }}
          >
            {items.map((item, i) => (
              <Box
                key={i}
                w="100%"
                bgColor="#F7F9FF"
                borderRadius="12px"
                border="1px dashed #C2D1FF"
                p={{ base: 5, md: 8 }}
              >
                <Box display="flex" justifyContent={{ base: "center", md: "flex-start" }}>
                  <item.Icon className="mt-2.5 w-8 h-8 md:w-6 md:h-6" />
                </Box>

                <Heading
                  mt={{ base: 4, md: 5 }}
                  fontSize={{ base: "22px", md: "32px" }}
                  fontWeight="semibold"
                  lineHeight="120%"
                  letterSpacing="-0.01em"
                  textAlign={{ base: "center", md: "left" }}
                  overflowWrap="anywhere"
                >
                  {item.title}
                </Heading>

                <Text
                  mt={{ base: 3, md: 2 }}
                  fontSize={{ base: "16px", md: "20px" }}
                  lineHeight="150%"
                  letterSpacing="-0.01em"
                  textAlign={{ base: "center", md: "left" }}
                  overflowWrap="anywhere"
                >
                  {item.text}
                </Text>
              </Box>
            ))}

            <Box
              p="8px"
              border="1px dashed #5A88FF"
              borderRadius="14px"
              w="100%"
              display={{ base: "flex", md: "none" }}
              justifyContent="center"
            >
              <Button
                bgColor="#114FF0"
                _hover={{ bgColor: "#114FF0" }}
                fontWeight={400}
                rightIcon={<DownIcon />}
                textColor="white"
                borderRadius="12px"
                fontSize="16px"
                w="100%"
                h="44px"
              >
                Contact Us
              </Button>
            </Box>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
