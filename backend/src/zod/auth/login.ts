import { z } from "zod";
import { appLanguages } from "../../utils/appLanaguges";
import { states } from "../../utils/locations";

export const loginSchema = z.object({
  identifier: z
    .union([z.string().email("Invalid email address"), z.string()])
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
  state: z.string().min(1, "State must be at least 1 characters"),
  city: z.string().min(1, "City must be at least 1 characters"),
});
