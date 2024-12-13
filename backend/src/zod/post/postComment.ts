import { z } from "zod";

export const postCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment must be at least 1 characters")
    .max(2000, "Comment must be at most 2000 characters"),
});
