import { z } from "zod";

export const actionUserSchema = z.object({
  userId: z.string(),
  postId: z.string(),
  message: z.string(),
  deletePost: z.boolean(),
  days: z.enum(["3", "7", "permanent"]),
});
