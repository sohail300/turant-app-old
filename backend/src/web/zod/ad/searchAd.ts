import { z } from "zod";

export const searchAdSchema = z.object({
  identifier: z.string(),
  timeFilter: z.enum(["active", "scheduled", "past"]),
  limit: z.number(),
  offset: z.number(),
});
