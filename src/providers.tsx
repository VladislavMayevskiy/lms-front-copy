import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import {
  QueryClientProvider,
} from "@tanstack/react-query";
import { queryClient } from "api";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { authStore } from "stores/authStore";
import { localStore } from "stores/localStore";
import { Loading } from "./components/shared/loading/Loading";
import SchoolBrandingProvider from "branding/SchoolBrandingProvider";

import {
  PointElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
} from "chart.js";

import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = PropsWithChildren;

const Providers = ({ children }: Props) => {
  const themeMode = authStore((s) => s.theme);
  const hydrated = authStore((s) => s.hydrated);
  const direction = localStore((s) => s.direction);

  if (!hydrated) return null;

  const theme = extendTheme({
    config: { initialColorMode: themeMode === "dark" ? "dark" : "light", useSystemColorMode: false },
    direction,
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.body.setAttribute("dir", direction);
  }, [direction]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider theme={theme}>
        <SchoolBrandingProvider>{children}</SchoolBrandingProvider>
      </ChakraProvider>
      <Loading />
      <ToastContainer />
    </QueryClientProvider>
  );
};


export default Providers;
