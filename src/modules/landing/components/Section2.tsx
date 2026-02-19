import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import GreenCircle from "assets/imgs/landing/GreenCircle.svg?react";

export default function Section2() {
  return (
    <Box 
      height={{ md: "626px", base: "auto" }} 
      mt={{ base: "-120px", md: -200 }} 
      position="relative" 
      pb={{ base: "60px", md: 0 }}
      width="100%"
      maxW="100vw"
    >
      
      <VStack width="100%">
        <Flex 
          display={{ base: "none", md: "flex" }} 
          position="relative" 
          zIndex="1" 
          gap={{ md: "100px", lg: "300px" }}
          height="186px" 
          ml={{ md: "32px", lg: "64px" }}
          mt="200px"
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          maxW="1400px"
          mx="auto"
          px={{ md: "20px", lg: 0 }}
        >
          <Heading 
            fontWeight="bold" 
            fontSize={{ md: "36px", lg: "48px" }}
            minW={{ md: "300px", lg: "auto" }}
            sx={{
              overflowWrap: "anywhere",
              wordBreak: "break-word"
            }}
          >
            Education, Delivered
          </Heading>
          <VStack gap="12px" h="auto" maxW="640px" width="100%">
            <Text 
              fontSize={{ md: "16px", lg: "18px" }} 
              lineHeight="150%" 
              letterSpacing="-0.01em" 
              width="100%" 
              maxW="600px"
              textAlign="left" 
              fontWeight="medium"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              Have you got great educational content but need a platform to distribute it? Our platform gives education content creators everything they need to package, distribute, and monetise courses for schools.
            </Text>
            <Text 
              fontSize={{ md: "16px", lg: "18px" }} 
              lineHeight="150%" 
              letterSpacing="-0.01em" 
              width="100%" 
              maxW="600px"
              fontWeight="medium"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              With seamless integration, secure payment options, and powerful teaching tools, you stay in control of your brand while reaching the schools that matter most.
            </Text>
          </VStack>
        </Flex>
        
        {/* Mobile Layout */}
        <VStack 
          display={{ base: "flex", md: "none" }} 
          align="flex-start" 
          spacing="16px" 
          width="100%" 
          maxW="335px" 
          mt="200px" 
          px="20px" 
          mx="auto"
        >
          <Heading 
            fontWeight="bold" 
            fontSize="32px" 
            width="100%"
            sx={{
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              hyphens: "auto"
            }}
          >
            Education, Delivered
          </Heading>
          <VStack align="flex-start" spacing="12px" width="100%">
            <Text 
              fontSize="16px" 
              lineHeight="150%" 
              letterSpacing="-0.01em" 
              width="100%" 
              fontWeight="medium"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              Have you got great educational content but need a platform to distribute it? Our platform gives education content creators everything they need to package, distribute, and monetise courses for schools.
            </Text>
            <Text 
              fontSize="16px" 
              lineHeight="150%" 
              letterSpacing="-0.01em" 
              width="100%" 
              fontWeight="medium"
              sx={{
                overflowWrap: "anywhere",
                wordBreak: "break-word"
              }}
            >
              With seamless integration, secure payment options, and powerful teaching tools, you stay in control of your brand while reaching the schools that matter most.
            </Text>
          </VStack>
        </VStack>
              <GreenCircle 
        style={{
          position: 'absolute',
          top: '400px',
          left: 'base:-110,md:100',
          zIndex: -1,
          pointerEvents: 'none'
        }}
          className="pointer-events-none absolute -z-10 left-[-110px] top-[400px] md:left-[162px]"
      />
      </VStack>
    </Box>
  );
}
