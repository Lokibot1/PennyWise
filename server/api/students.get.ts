// server/api/students.get.ts
import type { Student } from "~/shared/types/Student";
import type { ApiTableResponseData } from "~/shared/types/ApiTableResponseData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const { totalPages, totalItems, items } = await $fetch<
    ApiTableResponseData<Student>
  >(`${config.baseUrl}/students`, {
    method: "GET",
    query,
  });

  return { totalPages, totalItems, items };
});
