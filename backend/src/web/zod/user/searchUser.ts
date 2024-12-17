import { z } from "zod";

export const searchUserSchema = z.object({
  identifier: z.string(),
});
