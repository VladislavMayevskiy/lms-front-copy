import { useLocation } from "react-router-dom";

export const useTitleByPathname = () => {
  const { pathname } = useLocation();
  const pageTitle = pathname.split("/").pop()?.replace(/^\w/, (c) => c.toUpperCase()) || "";

  return { pageTitle }
};