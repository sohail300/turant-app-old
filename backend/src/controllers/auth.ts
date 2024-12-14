import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signupSchema } from "../zod/auth/signup";
import {
  sendRegisterMailOtp,
  sendRegisterPhoneOtp,
} from "../utils/sendRegisterOtp";
import { loginSchema } from "../zod/auth/login";
import { generateAccessToken } from "../utils/jwtMethods";
import { sendForgotPasswordOtpSchema } from "../zod/auth/sendForgotPasswordOtp";
import otpGenerator from "otp-generator";
import { verifyForgotPasswordOtpSchema } from "../zod/auth/verifyForgotPasswordOtp";
import { verifyRegisterOtpSchema } from "../zod/auth/verifyRegisterOtp";
import { Request, Response } from "express";
import { transporter } from "../utils/sendEmail";

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

    const {
      display_name,
      email,
      username,
      phone,
      password,
      app_language,
      state,
      city,
    } = inputData.data;

    const existingEmail = await prisma.user.findFirst({
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

    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUsername) {
      res.status(400).json({
        message: "Username already in use",
      });
      return;
    }

    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      res.status(400).json({
        message: "Phone number already in use",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        display_name,
        email,
        username,
        username_last_edit: new Date(),
        image: "",
        profile_url: `turant-news.in/${username}`, //! changes
        phone,
        password: hashedPassword,
        app_language,
        state,
        city,
        created_at: new Date(),
        verified: false,
        role: "user",
      },
    });

    await Promise.all([
      sendRegisterMailOtp(email),
      sendRegisterPhoneOtp(phone),
    ]);

    const accessToken = generateAccessToken(newUser.user_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    // Respond with success
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
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

    const { identifier, password, state, city, app_language } = inputData.data;
    console.log(identifier, password, state, city, app_language);

    // Find the user by either email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier }, // Check by email
          { phone: identifier }, // Check by phone
        ],
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

    const accessToken = generateAccessToken(user.user_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    // change state and city of user
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { state, city, app_language },
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
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

    const { email, phone, medium } = inputData.data;

    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    if (medium == "email") {
      if (!email) {
        res
          .status(400)
          .json({ message: "Email is required for OTP generation" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      // ! TODO: Send OTP to email

      await prisma.otp.create({
        data: {
          user_id: user.user_id,
          related: "forgot_password", // OTP type
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: 'OTP For Forgot Password',
        text: `OTP : ${otp}`
      };
    
      await transporter.sendMail(mailOptions)
    } else if (medium == "phone") {
      if (!phone) {
        res
          .status(400)
          .json({ message: "Phone Number is required for OTP generation" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { phone },
      });

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      // ! TODO: Send OTP to phone

      await prisma.otp.create({
        data: {
          user_id: user.user_id,
          related: "forgot_password", // OTP type
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    }

    console.log(`Sending phone OTP to ${phone}: ${otp}`);
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

    const { otp, email, phone, medium, password } = inputData.data;

    let user;

    // Validate user based on the medium
    if (medium === "email") {
      if (!email) {
        res.status(400).json({ message: "Email is required for verification" });
        return;
      }

      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (medium === "phone") {
      if (!phone) {
        res
          .status(400)
          .json({ message: "Phone number is required for verification" });
        return;
      }

      user = await prisma.user.findUnique({
        where: { phone },
      });
    } else {
      res.status(400).json({ message: "Invalid medium" });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find OTP record for the user
    const otpRecord = await prisma.otp.findFirst({
      where: {
        user_id: user.user_id,
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
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword },
    });

    // Optionally delete the OTP record after successful verification
    await prisma.otp.delete({
      where: { otp_id: otpRecord.otp_id },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error verifying forgot password OTP:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendRegisterOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.headers;

    const user = await prisma.user.findUnique({
      where: {
        user_id: Number(userId),
      },
      select: {
        email: true,
        phone: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { email, phone } = user;

    await Promise.all([
      sendRegisterMailOtp(email),
      // sendRegisterPhoneOtp(phone),
    ]);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending register OTP:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyRegisterOtp = async (req: Request, res: Response) => {
  try {
    const inputData = verifyRegisterOtpSchema.safeParse(req.body);

    if (!inputData.success) {
      res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, phone } = inputData.data;
    console.log(email, phone);

    // Validate Email OTP
    const emailOtpRecord = await prisma.otp.findFirst({
      where: {
        otp: email,
        related: "register_mail",
      },
    });

    if (!emailOtpRecord) {
      res.status(400).json({ message: "Invalid or expired email OTP" });
      return;
    }

    if (new Date(emailOtpRecord.expires_at) < new Date()) {
      res.status(400).json({ message: "Email OTP has expired" });
      return;
    }

    // Validate Phone OTP
    const phoneOtpRecord = await prisma.otp.findFirst({
      where: {
        otp: phone,
        related: "register_phone",
      },
    });

    if (!phoneOtpRecord) {
      res.status(400).json({ message: "Invalid or expired phone OTP" });
      return;
    }

    if (new Date(phoneOtpRecord.expires_at) < new Date()) {
      res.status(400).json({ message: "Phone OTP has expired" });
      return;
    }

    const userId = emailOtpRecord.user_id; // Both OTPs should belong to the same user
    const phoneUserId = phoneOtpRecord.user_id;

    if (userId !== phoneUserId) {
      res
        .status(400)
        .json({ message: "Email and phone OTPs do not match the same user" });
      return;
    }

    await prisma.user.update({
      where: { user_id: userId },
      data: { verified: true },
    });

    // Clean up OTPs
    await Promise.all([
      prisma.otp.delete({ where: { otp_id: emailOtpRecord.otp_id } }),
      prisma.otp.delete({ where: { otp_id: phoneOtpRecord.otp_id } }),
    ]);

    res.json({
      success: true,
      message: "Both OTPs verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
