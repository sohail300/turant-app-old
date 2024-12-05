import { z } from "zod";

export const sendForgotPasswordOtpSchema = z.object({
  medium: z.enum(["email", "phone"], {
    errorMap: () => ({
      message: "Medium must be either email or phone",
    }),
  }),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});
