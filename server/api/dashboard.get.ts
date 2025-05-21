// server/api/dashboard.get.ts
import type { ApiResponseData } from "~/shared/types/ApiResponseData";
import type { Dashboard } from "~/shared/types/Dashboard";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const { data } = await $fetch<ApiResponseData<Dashboard>>(
    `${config.baseUrl}/dashboard`,
    {
      method: "GET",
    }
  );

  return data;
});
