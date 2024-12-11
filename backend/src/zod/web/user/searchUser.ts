import { z } from "zod";

export const searchUserSchema = z.object({
  identifier: z.string().min(1, "Identifier must be at least 1 characters"),
  limit: z.number(),
  offset: z.number(),
});
