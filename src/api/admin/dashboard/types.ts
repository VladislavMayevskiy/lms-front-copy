import type { ApiDataResponse } from "api/types";

export type ApiNewUsersStats = {
  month: string;
  count: number;
};

export type ApiNewUsersStatsResponse = ApiDataResponse<ApiNewUsersStats[]>;