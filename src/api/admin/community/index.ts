import { client } from "api";
import { AdminApiRoutes } from "api/constants";
import type { ApiCommunityList, GetSchoolsByDistrictParams } from "./types";;

export const getSchoolByDistrict = async (districtId: number, params?: GetSchoolsByDistrictParams): Promise<ApiCommunityList> => {
    const response = await client.get(`${AdminApiRoutes.schools}?district.id=${districtId}`,{
    params: {
      ...(params?.search && { "filter[search]": params.search }),
      ...(districtId && { "filter[district.id]": districtId }),
      ...(params?.sort && { sort: params.sort }),
    }})
    return response.data
}
