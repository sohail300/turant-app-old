import { z } from "zod";

export const verifyForgotPasswordOtpSchema = z.object({
  medium: z.enum(["email", "phone"], {
    errorMap: () => ({
      message: "Medium must be either email or phone",
    }),
  }),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .optional(),
  otp: z
    .string()
    .min(4, "OTP must be exactly 4 digits")
    .max(4, "OTP must be exactly 4 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
