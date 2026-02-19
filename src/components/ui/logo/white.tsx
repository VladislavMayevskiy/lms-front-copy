import {
  HStack,
  Text
} from "@chakra-ui/react";
import LogoIcon from "assets/imgs/user/mobile/logo.svg?react"
import GazaLogo from "assets/imgs/gaza.jpeg";
import { authStore } from "stores/authStore";

export default function LogoWhite() {
  const user = authStore((store) => store.user);

  return user?.name.includes("Gaza") ? (
    <div className="max-w-[100px] md:max-w-60 overflow-hidden">
      <img src={GazaLogo} alt="Gaza Logo" className="w-full h-full object-cover" />
    </div>
  ): (
    <HStack>
      <LogoIcon style={{ color: "white" }} />
      <Text color="#ffffffff" fontWeight="800">COURSA</Text>
    </HStack>
  );
};