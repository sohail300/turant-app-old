import { z } from "zod";
import { appLanguages } from "../utils/appLanaguges";
import { states } from "../utils/locations";

export const signupSchema = z.object({
  display_name: z.string().min(1, "Name must be at least 1 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  app_language: z.enum(appLanguages, {
    errorMap: () => ({
      message: "App language must be either 'english' or 'hindi'",
    }),
  }),
  state: z.enum(states, {
    errorMap: () => ({
      message: "States must be within the options provided",
    }),
  }),
  city: z.enum(states, {
    errorMap: () => ({
      message: "Cities must be within the options provided",
    }),
  }),
});
