
import LogoIcon from "assets/imgs/logo.png";
import GazaLogo from "assets/imgs/gaza.jpeg";
import DefaultBrandLogo from "assets/imgs/default-logo.png";
import { authStore } from "stores/authStore";
import { useSchoolBranding } from "branding/useSchoolBranding";

export default function Logo() {
  const user = authStore((store) => store.user);
  const { branding } = useSchoolBranding();

  if (branding.logoUrl) {
    const isDefaultLogo =
      branding.logoUrl === DefaultBrandLogo || branding.logoUrl === LogoIcon;
    return (
      <div
        className={
          isDefaultLogo
            ? "max-w-[110px] md:max-w-[140px] overflow-hidden"
            : "max-w-[140px] md:max-w-60 overflow-hidden"
        }
      >
        <img
          src={branding.logoUrl}
          alt="School logo"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

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
