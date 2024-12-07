import { z } from "zod";
import { appLanguages } from "../../utils/appLanaguges";
import { states } from "../../utils/locations";

export const loginSchema = z.object({
  identifier: z
    .union([
      z.string().email("Invalid email address"),
      z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
    ])
    .refine(
      (val) => {
        return val.length > 0;
      },
      {
        message: "Identifier must be either an email or phone number.",
      }
    ),
  password: z.string().min(1, "Password must be at least 1 character long"),
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
  city: z.string().min(1, "City must be at least 1 characters"),
});
