import { z } from "zod";

export const searchUserSchema = z.object({
  identifier: z.string(),
  limit: z.number(),
  offset: z.number(),
});
