import { z } from "zod";

export const verifyRegisterOtpSchema = z.object({
  email: z
    .string()
    .min(4, "OTP must be exactly 4 digits")
    .max(4, "OTP must be exactly 4 digits"),
  phone: z
    .string()
    .min(4, "OTP must be exactly 4 digits")
    .max(4, "OTP must be exactly 4 digits"),
});
