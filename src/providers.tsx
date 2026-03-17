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
import { Loading } from "./components/shared/loading/Loading";

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

const lightTheme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  direction: "ltr",
});

const darkTheme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  direction: "ltr",
});

const Providers = ({ children }: Props) => {
  const themeMode = authStore((s) => s.theme);
  const hydrated = authStore((s) => s.hydrated);

  if (!hydrated) return null;

  const theme = themeMode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    document.body.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
      <Loading />
      <ToastContainer />
    </QueryClientProvider>
  );
};


export default Providers;
