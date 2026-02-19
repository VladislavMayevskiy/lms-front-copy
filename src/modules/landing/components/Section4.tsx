import { Box, Text, Heading, VStack, HStack } from "@chakra-ui/react";
import GreenOne from "assets/imgs/landing/GreenOne.svg?react";
import OrangeThree from "assets/imgs/landing/OrangeThree.svg?react";
import BlueTwo from "assets/imgs/landing/BlueTwo.svg?react";
import RedFour from "assets/imgs/landing/RedFour.svg?react";
import RedSquare from "assets/imgs/landing/RedSquare.svg?react";

export default function Section4() {
  return (
    <Box 
      width="100%" 
      maxW={{ md: "1416px" }} 
      height={{ base: "auto", md: "1200px" }} 
      mx="auto" 
      px={{ base: "20px", md: 0 }}
      position="relative"
      overflow="hidden"
      id="learn-more-section"
    >
      <Heading 
        textAlign="center" 
        mt={{ base: "60px", md: "200px" }} 
        mb={{ base: "40px", md: "80px" }} 
        lineHeight="120%" 
        letterSpacing="-0.01em" 
        fontSize={{ base: "32px", md: "56px" }} 
        fontWeight="bold"
        px={{ base: "20px", md: 0 }}
        sx={{
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          hyphens: "auto"
        }}
      >
        How It Works
      </Heading>

      <VStack 
        spacing="16px" 
        align="center" 
        display={{ base: "flex", md: "none" }} 
        zIndex={1}
        width="100%"
      >
{[
  { Icon: GreenOne,   title: "Brand Your Platform",        text: "We customise the platform with your branding and domain." },
  { Icon: BlueTwo,    title: "Sell to Schools and Students", text: "We customise the platform with your branding and domain." },
  { Icon: OrangeThree,title: "Upload Your Content",        text: "Add courses, resources, assessments, and interactive content." },
  { Icon: RedFour,    title: "Support Teachers & Learners", text: "Schools get easy access to your content, and you get recurring revenue." }
].map((item) => (
          <Box 
            key={item.title} 
            bgColor="rgba(17,79,240,0.03)" 
            width="100%" 
            maxW="335px" 
            height="auto" 
            minH="263px"
            borderRadius="12px" 
            p="24px" 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            textAlign="center" 
            backdropFilter="blur(10px)"
          >
            <item.Icon 
              style={{
                marginBottom: '10px',
                marginTop: '5px'
              }}
            />
            <Heading 
              fontSize="22px" 
              color="#2C2C2C" 
              fontWeight="semibold" 
              mb="10px" 
              mt="10px"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                hyphens: "auto"
              }}
            >
              {item.title}
            </Heading>
            <Text 
              className="footer-roboto" 
              fontSize="16px" 
              color="#2C2C2C" 
              lineHeight="150%" 
              letterSpacing="-0.01em"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              {item.text}
            </Text>
          </Box>
        ))}
        

      </VStack>

      <VStack spacing="18px" mt="80px" display={{ base: "none", md: "flex" }} maxW="1286px" mx="auto">
        <HStack spacing="18px" flexWrap={{ base: "wrap", lg: "nowrap" }} justify="center">
          <Box 
            bgColor="rgba(17,79,240,0.03)" 
            backdropFilter="blur(10px)" 
            w={{ base: "100%", lg: "634px" }} 
            maxW="634px"
            h="auto" 
            minH="133px"
            borderRadius="12px" 
            p="32px" 
            display="flex" 
            alignItems="flex-start" 
            gap="16px"
          >
            <GreenOne style={{ flexShrink: 0 }} />
            <VStack align="start" spacing="8px" width="100%">
              <Heading 
                fontSize="24px" 
                fontWeight="semibold" 
                lineHeight="120%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Brand Your Platform
              </Heading>
              <Text 
                className="footer-roboto" 
                fontSize="16px" 
                lineHeight="150%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                We customise the platform with your branding and domain.
              </Text>
            </VStack>
          </Box>
          <Box 
            bgColor="rgba(17,79,240,0.03)" 
            backdropFilter="blur(10px)" 
            w={{ base: "100%", lg: "634px" }} 
            maxW="634px"
            h="auto" 
            minH="133px"
            borderRadius="12px" 
            p="32px" 
            display="flex" 
            alignItems="flex-start" 
            gap="16px"
          >
            <OrangeThree style={{ flexShrink: 0 }} />
            <VStack align="start" spacing="8px" width="100%">
              <Heading 
                fontSize="24px" 
                fontWeight="semibold" 
                lineHeight="120%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Upload Your Content
              </Heading>
              <Text 
                className="footer-roboto" 
                fontSize="16px" 
                lineHeight="150%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Add courses, resources, assessments, and interactive content.
              </Text>
            </VStack>
          </Box>
        </HStack>

        <HStack spacing="18px" flexWrap={{ base: "wrap", lg: "nowrap" }} justify="center">
          <Box 
            bgColor="rgba(17,79,240,0.03)" 
            backdropFilter="blur(10px)" 
            w={{ base: "100%", lg: "634px" }} 
            maxW="634px"
            h="auto" 
            minH="133px"
            borderRadius="12px" 
            p="32px" 
            display="flex" 
            alignItems="flex-start" 
            gap="16px"
          >
            <BlueTwo style={{ flexShrink: 0 }} />
            <VStack align="start" spacing="8px" width="100%">
              <Heading 
                fontSize="24px" 
                fontWeight="semibold" 
                lineHeight="120%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Sell to Schools and Students
              </Heading>
              <Text 
                className="footer-roboto" 
                fontSize="16px" 
                lineHeight="150%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Offer your platform directly to institutions and learners.
              </Text>
            </VStack>
          </Box>
          <Box 
            bgColor="rgba(17,79,240,0.03)" 
            backdropFilter="blur(10px)" 
            w={{ base: "100%", lg: "634px" }} 
            maxW="634px"
            h="auto" 
            minH="133px"
            borderRadius="12px" 
            p="32px" 
            display="flex" 
            alignItems="flex-start" 
            gap="16px"
          >
            <RedFour style={{ flexShrink: 0 }} />
            <VStack align="start" spacing="8px" width="100%">
              <Heading 
                fontSize="24px" 
                fontWeight="semibold" 
                lineHeight="120%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Support Teachers & Learners
              </Heading>
              <Text 
                className="footer-roboto" 
                fontSize="16px" 
                lineHeight="150%" 
                letterSpacing="-0.01em"
                sx={{
                  overflowWrap: "anywhere",
                  wordBreak: "break-word"
                }}
              >
                Schools get easy access to your content, and you get recurring revenue.
              </Text>
            </VStack>
          </Box>
        </HStack>
      </VStack>

      <RedSquare 
        style={{
          position: 'absolute',
          right: '0px',
          bottom: '50px',
          zIndex: -1,
          pointerEvents: 'none',
          width: "300px",
          height:"300px"
        }}
        className="hidden md:block"
      />
    </Box>
  );
}
