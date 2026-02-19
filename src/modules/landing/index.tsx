import { Box } from "@chakra-ui/react";
import Section1 from "./components/Section1";
import Section15 from "./components/Section1_5";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Footer from "./components/Footer";

function Landing () {
  return (
    <Box
      overflow="hidden"
      width="100%"
      minH="100vh"
      position="relative"
      sx={{
        // Prevent horizontal scroll
        overflowX: "clip",
        // Ensure box-sizing
        "*, *::before, *::after": {
          boxSizing: "border-box"
        }
      }}
    >
      <Section1 />
      <Section15 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </Box>
  );
}

export default Landing;