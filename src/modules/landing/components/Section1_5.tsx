import { Box, HStack } from "@chakra-ui/react";

export default function Section1_5() {
  return (
    <Box 
      height={{ md: 72, base: "auto" }} 
      mt={{ md: "-95px", base: "-40px" }} 
      width="100%"
      maxW="100vw"
      position="relative" 
      overflow="hidden" 
      zIndex={1} 
      px={{ base: "20px", md: 0 }}
      sx={{
        // Hide scrollbar but allow scrolling on mobile
        "&::-webkit-scrollbar": {
          display: "none"
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }}
    >
      <HStack 
        gap={{ md: "32px", base: "10px" }} 
        position={{ md: "absolute", base: "relative" }} 
        overflowX={{ base: "auto", md: "visible" }} 
        pb={{ base: "10px", md: 0 }}
        sx={{
          // Smooth horizontal scroll on mobile
          WebkitOverflowScrolling: "touch"
        }}
      >
        <Box 
          minW={{ md: "442px", base: "250px" }} 
          width={{ md: "442px", base: "250px" }} 
          height={{ md: "72px", base: "52px" }} 
          borderRadius={12} 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          textAlign="center" 
          fontSize={{ md: 20, base: 12 }} 
          fontWeight="semibold" 
          lineHeight="120%" 
          letterSpacing="-0.01em" 
          color="black" 
          bgColor="rgba(17, 79, 240, 0.03)" 
          backdropFilter="blur(10px)" 
          px="12px"
          flexShrink={0}
        >
          DELIVER EDUCATION, YOUR WAY
        </Box>

        <Box 
          minW={{ md: "721px", base: "300px" }} 
          width={{ md: "721px", base: "300px" }} 
          height={{ md: "72px", base: "52px" }} 
          fontSize={{ md: 20, base: 12 }} 
          fontWeight="semibold" 
          letterSpacing="-0.01em" 
          lineHeight="120%" 
          borderRadius={12} 
          bgColor="rgba(17, 79, 240, 0.03)" 
          color="black" 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          textAlign="center" 
          px="12px"
          flexShrink={0}
        >
          GROW YOUR AUDIENCE WITHOUT GIVING UP YOUR IDENTITY
        </Box>

        <Box 
          minW={{ md: "750px", base: "280px" }} 
          width={{ md: "750px", base: "280px" }} 
          height={{ md: "72px", base: "52px" }} 
          fontSize={{ md: 20, base: 12 }} 
          fontWeight="semibold" 
          letterSpacing="-0.01em" 
          lineHeight="120%" 
          borderRadius={12} 
          bgColor="rgba(17, 79, 240, 0.03)" 
          backdropFilter="blur(10px)" 
          color="black" 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          textAlign="center" 
          px="12px"
          flexShrink={0}
        >
          FULL CONTROL OVER YOUR CONTENT, PRICING, AND BRANDING
        </Box>
      </HStack>
    </Box>
  );
};