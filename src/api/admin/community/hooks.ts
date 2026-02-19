import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSchoolByDistrict } from "./index";
import type { ApiCommunityList, GetSchoolsByDistrictParams } from "./types";

export const useGetSchoolsByDistrict = (
  districtId?: number | null,
  params?: GetSchoolsByDistrictParams
) => {
  const isEnabled = typeof districtId === "number" && districtId > 0;

  const response = useQuery<ApiCommunityList>({
    queryKey: ["schools-by-district", districtId, params?.search ?? "", params?.sort ?? ""],
    queryFn: () => getSchoolByDistrict(districtId!, params),
    enabled: isEnabled,
    staleTime: 1000 * 60,
  });

  const schools = useMemo(() => {
    if (!isEnabled) return [];

    return response.data?.data ?? [];
  }, [response.data, isEnabled]);

  return {
    ...response,
    schools,
  };
};
