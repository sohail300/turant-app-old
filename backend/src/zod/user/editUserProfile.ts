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
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password must be at least 1 character long"),
  app_language: z.enum(["english", "hindi"]),
  state: z.enum(["delhi", "bihar", "punjab", "haryana", "kerala"]),
  city: z.string().min(1, "City must be at least 1 characters"),
  otp: z.string().min(4).max(4)
});
