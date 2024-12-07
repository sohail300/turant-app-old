import { z } from "zod";

export const postCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment must be at least 1 characters")
    .max(500, "Comment must be at most 500 characters"),
});
