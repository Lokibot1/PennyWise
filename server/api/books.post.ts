// server/api/books.get.ts
import type { Book } from "~/shared/types/Book";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  await $fetch<Book>(`${config.baseUrl}/books`, {
    method: "POST",
    body: { ...body },
  });

  return { message: "Book created successfully" };
});
