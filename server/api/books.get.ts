// server/api/books.get.ts
import type { Book } from "~/shared/types/Book";
import type { ApiTableResponseData } from "~/shared/types/ApiTableResponseData";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const { totalPages, totalItems, items } = await $fetch<
    ApiTableResponseData<Book>
  >(`${config.baseUrl}/books`, {
    method: "GET",
    query,
  });

  return { totalPages, totalItems, items };
});
