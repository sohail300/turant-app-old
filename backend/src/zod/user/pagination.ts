import { z } from "zod";

export const paginationSchema = z.object({
  limit: z.number(),
  offset: z.number(),
});
