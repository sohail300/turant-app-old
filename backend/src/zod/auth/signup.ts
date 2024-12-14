import { z } from "zod";
import { appLanguages } from "../../utils/appLanaguges";
import { states } from "../../utils/locations";

export const signupSchema = z.object({
  display_name: z.string().min(1, "Name must be at least 1 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  app_language: z.enum(appLanguages, {
    errorMap: () => ({
      message: "App language must be either 'english' or 'hindi'",
    }),
  }),
  state: z.string().min(1, "State must be at least 1 characters"),
  city: z.string().min(1, "City must be at least 1 characters"),
});
