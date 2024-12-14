import { z } from "zod";

export const verifyChangePhoneOtpSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be exactly 4 digits")
    .max(4, "OTP must be exactly 4 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});
