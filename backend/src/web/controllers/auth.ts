import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signupSchema } from "../zod/auth/signup";
import {
  sendRegisterMailOtp,
  sendRegisterPhoneOtp,
} from "../../utils/sendRegisterOtp";
import { loginSchema } from "../zod/auth/login";
import { generateAccessToken } from "../../utils/jwtMethods";
import { sendForgotPasswordOtpSchema } from "../zod/auth/sendForgotPasswordOtp";
import otpGenerator from "otp-generator";
import { verifyForgotPasswordOtpSchema } from "../zod/auth/verifyForgotPasswordOtp";
import { verifyRegisterOtpSchema } from "../zod/auth/verifyRegisterOtp";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const inputData = signupSchema.safeParse(req.body);

    if (inputData.success === false) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = inputData.data;

    const existingEmail = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (existingEmail) {
      res.status(400).json({
        message: "Email already in use",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(newUser.admin_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    // Respond with success
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.admin_id,
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    // Handle other errors
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const inputData = loginSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = inputData.data;

    // Find the user by either email or phone
    const user = await prisma.admin.findFirst({
      where: {
        email: { contains: email, mode: "insensitive" },
      },
    });

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const accessToken = generateAccessToken(user.admin_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.admin_id,
        accessToken,
        // refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendForgotPasswordOtp = async (req: Request, res: Response) => {
  try {
    const inputData = sendForgotPasswordOtpSchema.safeParse(req.body);

    if (inputData.success === false) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { email } = inputData.data;

    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    if (!email) {
      res.status(400).json({ message: "Email is required for OTP generation" });
      return;
    }

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // ! TODO: Send OTP to email

    await prisma.adminOtp.create({
      data: {
        admin_id: user.admin_id,
        related: "forgot_password", // OTP type
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    console.log(`Sending email OTP to ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending forgot password OTP:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyForgotPasswordOtp = async (req: Request, res: Response) => {
  try {
    const inputData = verifyForgotPasswordOtpSchema.safeParse(req.body);

    if (inputData.success === false) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { otp, email, password } = inputData.data;

    if (!email) {
      res.status(400).json({ message: "Email is required for verification" });
      return;
    }

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find OTP record for the user
    const otpRecord = await prisma.adminOtp.findFirst({
      where: {
        admin_id: user.admin_id,
        related: "forgot_password",
        otp,
      },
    });

    if (!otpRecord) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      res.status(400).json({ message: "OTP has expired" });
      return;
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.update({
      where: { admin_id: user.admin_id },
      data: { password: hashedPassword },
    });

    // Optionally delete the OTP record after successful verification
    await prisma.adminOtp.delete({
      where: { admin_otp_id: otpRecord.admin_otp_id },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// export const sendRegisterOtp = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.headers;

//     const user = await prisma.user.findUnique({
//       where: {
//         user_id: Number(userId),
//       },
//       select: {
//         email: true,
//         phone: true,
//       },
//     });

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const { email, phone } = user;

//     await Promise.all([
//       sendRegisterMailOtp(email),
//       sendRegisterPhoneOtp(phone),
//     ]);

//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Error sending register OTP:", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// export const verifyRegisterOtp = async (req: Request, res: Response) => {
//   try {
//     const inputData = verifyRegisterOtpSchema.safeParse(req.body);

//     if (!inputData.success) {
//       res.status(400).json({
//         message: "Validation error",
//         errors: inputData.error.flatten().fieldErrors,
//       });
//       return;
//     }

//     const { email, phone } = inputData.data;

//     // Validate Email OTP
//     const emailOtpRecord = await prisma.adminOtp.findFirst({
//       where: {
//         otp: email,
//         related: "register_mail",
//       },
//     });

//     if (!emailOtpRecord) {
//       res.status(400).json({ message: "Invalid or expired email OTP" });
//       return;
//     }

//     if (new Date(emailOtpRecord.expires_at) < new Date()) {
//       res.status(400).json({ message: "Email OTP has expired" });
//       return;
//     }

//     // Validate Phone OTP
//     const phoneOtpRecord = await prisma.adminOtp.findFirst({
//       where: {
//         otp: phone,
//         related: "register_phone",
//       },
//     });

//     if (!phoneOtpRecord) {
//       res.status(400).json({ message: "Invalid or expired phone OTP" });
//       return;
//     }

//     if (new Date(phoneOtpRecord.expires_at) < new Date()) {
//       res.status(400).json({ message: "Phone OTP has expired" });
//       return;
//     }

//     // Mark user as verified (if both OTPs are valid)
//     const userId = emailOtpRecord.user_id; // Both OTPs should belong to the same user
//     const phoneUserId = phoneOtpRecord.user_id;

//     if (userId !== phoneUserId) {
//       res
//         .status(400)
//         .json({ message: "Email and phone OTPs do not match the same user" });
//       return;
//     }

//     await prisma.user.update({
//       where: { user_id: userId },
//       data: { verified: true },
//     });

//     // Clean up OTPs
//     await Promise.all([
//       prisma.adminOtp.delete({ where: { otp_id: emailOtpRecord.otp_id } }),
//       prisma.adminOtp.delete({ where: { otp_id: phoneOtpRecord.otp_id } }),
//     ]);

//     res.json({
//       success: true,
//       message: "Both OTPs verified successfully",
//     });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
