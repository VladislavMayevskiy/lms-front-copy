
import LogoIcon from "assets/imgs/logo.png";
import GazaLogo from "assets/imgs/gaza.jpeg";
import { authStore } from "stores/authStore";

export default function Logo() {
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
        w-[150px] h-[150px]
        md:w-[220px] md:h-[220px]
        object-contain
      "
    />
  </div>
  );
};
