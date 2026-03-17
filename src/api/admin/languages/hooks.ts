import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "./index";
import type { ApiLanguagesListResponse } from "./types";

export const useGetLanguages = () => {
  return useQuery<ApiLanguagesListResponse>({
    queryKey: ["admin-languages"],
    queryFn: getLanguages,
    staleTime: 0,   // data is always stale – always background-refetch on mount
    gcTime: 0,      // evict cached data immediately on unmount so the next mount
                    // always fires a real GET instead of silently serving old objects
  });
};
