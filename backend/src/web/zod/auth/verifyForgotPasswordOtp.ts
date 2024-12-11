import { z } from "zod";

export const verifyForgotPasswordOtpSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  otp: z
    .string()
    .min(4, "OTP must be exactly 4 digits")
    .max(4, "OTP must be exactly 4 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
