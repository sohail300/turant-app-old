import { z } from "zod";

export const editUserProfileSchema = z.object({
  display_name: z.string().min(1, "Name must be at least 1 characters"),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]{4,20}$/,
      "Username must contain only alphanumeric characters and underscores"
    ),
  email: z.string().email("Invalid email address"),
  app_language: z.enum(["english", "hindi"]),
  state: z.enum(["delhi", "bihar", "punjab", "haryana", "kerala"]),
  city: z.string().min(1, "City must be at least 1 characters"),
});
