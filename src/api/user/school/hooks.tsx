import { getSchool } from "./index";
import { useQuery } from "@tanstack/react-query";
import type { ApiSchoolType } from "./types";

export const useGetSchools = (id: number) => {
  const query = useQuery<ApiSchoolType>({
    queryKey: ["schools-public-list"],
    queryFn: () => getSchool(id),
  });

  return {
    ...query,
    schools: query.data,
  };
};