import { z } from "zod";

export const sendEditProfileOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
});
