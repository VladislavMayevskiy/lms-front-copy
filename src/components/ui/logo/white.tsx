
import LogoIcon from "assets/imgs/logo.png";
import GazaLogo from "assets/imgs/gaza.jpeg";
import { authStore } from "stores/authStore";

export default function LogoWhite() {
  const user = authStore((store) => store.user);

  return user?.name.includes("Gaza") ? (
    <div className="max-w-[100px] md:max-w-60 overflow-hidden">
      <img src={GazaLogo} alt="Gaza Logo" className="w-full h-full object-cover" />
    </div>
  ): (
  <div className="overflow-hidden">
    <img
      src={LogoIcon}
      alt="Gaza Logo"
      className="
        w-[110px] h-[44px]
        md:w-[140px] md:h-[56px]
        object-contain
      "
    />
  </div>
  );
};