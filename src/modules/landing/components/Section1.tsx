import { Box, Text, Heading, Flex, VStack, Button } from "@chakra-ui/react";
import TrianglePurple from "assets/imgs/landing/TrianglePurple.svg?react";
import RedCircle from "assets/imgs/landing/RedCircle.svg?react";
import StarBlue from "assets/imgs/landing/StarBlue.svg?react";
import Cub from "assets/imgs/landing/Cub.svg?react";
import DownIcon from "assets/imgs/landing/Down.svg?react";
import Header from "./Header";

export default function Section1() {
  return (
    <Box 
      position="relative" 
      width="100%" 
      height={{ base: "682px", md: "820px", lg: "920px" }} 
      mx="auto" 
      zIndex={0} 
      px={{ base: "20px", md: 8, lg: 0 }} 
      py={{ base: 8, md: 10, lg: 0 }} 
      overflow="hidden"
      sx={{
        maxWidth: "100vw"
      }}
    >
      <Box position="relative" zIndex={5}><Header /></Box>


      <TrianglePurple 
        style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          width: '140px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        className="md:top-[-10px] md:left-[120px] md:w-[180px] lg:top-0 lg:left-[227px] lg:w-auto"
      />
      <RedCircle 
        style={{
          position: 'absolute',
          top: '-165px',
          right: '-80px',
          width: '297px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        className="md:top-[-220px] md:right-[-100px] md:w-[280px] lg:top-[-207px] lg:right-[0px] lg:w-auto"
      />
      <StarBlue 
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '-134px',
          width: '336px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
        className="md:bottom-[340px] md:left-[-170px] md:w-[290px] lg:bottom-[370px] lg:left-[-202px] lg:w-auto"
      />
      <Cub 
        style={{
          position: 'absolute',
          bottom: '110px',
          right: '-100px',
          width: '290px',
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
        className="md:bottom-[230px] md:right-[-50px] md:w-[200px] lg:bottom-[200px] lg:right-[0px] lg:w-auto"
      />

      <Flex 
        position="relative" 
        mt={{ base: "80px", md: "40px", lg: "20px" }} 
        width="100%" 
        maxW={{ md: "1000px", lg: "1280px" }}
        height={{ base: "auto", md: "600px", lg: "700px" }} 
        justify="center" 
        align="center" 
        mx="auto"
      >
        <VStack 
          gap={{ base: "62px", md: "50px", lg: "62px" }} 
          spacing={{ base: "24px", md: "26px", lg: "28px" }} 
          width="100%" 
          maxW={{ md: "720px", lg: "858px" }}
          textAlign="center" 
          justify="center" 
          zIndex={2}
          px={{ base: "20px", md: 0 }}
        >
          <Heading 
            fontSize={{ base: "30px", md: "44px", lg: "56px" }} 
            lineHeight="120%" 
            letterSpacing="-0.01em" 
            color="#1A1A1A" 
            width="100%"
            maxW={{ base: "100%", md: "720px", lg: "858px" }}
            mx="auto"
            sx={{
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              hyphens: "auto"
            }}
          >
            Empower Schools with Your Own Branded Learning Platform
          </Heading>
          <Text 
            fontSize={{ base: "16px", md: "20px", lg: "24px" }} 
            lineHeight="150%" 
            color="#4B4B4B" 
            letterSpacing="-0.01em" 
            width="100%"
            maxW={{ base: "100%", md: "720px", lg: "auto" }}
            mx="auto"
            sx={{
              overflowWrap: "anywhere",
              wordBreak: "break-word"
            }}
          >
            Sell your courses and educational content directly to schools and students — all under your brand.
          </Text>
          <Box 
            px={{ base: "6px", md: "8px", lg: "10px" }} 
            py={{ base: "6px", md: "8px", lg: "9px" }} 
            border="1px dashed #114FF0" 
            borderRadius="12px" 
            w={{ base: "150px", md: "160px", lg: "178px" }} 
            h={{ base: "56px", md: "60px", lg: "68px" }} 
            mx="auto" 
            display={{ base: "none", md: "flex" }} 
            alignItems="center" 
            justifyContent="center"
          >
            <Button 
              onClick={() => {
                document.getElementById("learn-more-section")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
              });
            }}
              _hover={{ bgColor: "#114FF0" }} 
              bg="#114FF0" 
              fontWeight="medium" 
              rightIcon={<DownIcon />} 
              color="white" 
              borderRadius="12px" 
              fontSize={{ base: 14, md: 15, lg: 16 }} 
              w={{ base: "128px", md: "140px", lg: "154px" }} 
              h={{ base: "40px", md: "44px", lg: "48px" }}
            >
              Learn more
            </Button>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
