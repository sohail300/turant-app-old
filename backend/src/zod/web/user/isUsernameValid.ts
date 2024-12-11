import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]{4,20}$/,
      "Username must contain only alphanumeric characters and underscores"
    ),
});
