import { z } from "zod";

export const sendForgotPasswordOtpSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
});
