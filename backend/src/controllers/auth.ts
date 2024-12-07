import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signupSchema } from "../zod/auth/signup";
import {
  sendRegisterMailOtp,
  sendRegisterPhoneOtp,
} from "../utils/sendRegisterOtp";
import { loginSchema } from "../zod/auth/login";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtMethods";
import { sendForgotPasswordOtpSchema } from "../zod/auth/sendForgotPasswordOtp";
import otpGenerator from "otp-generator";
import { verifyForgotPasswordOtpSchema } from "../zod/auth/verifyForgotPasswordOtp";
import { verifyRegisterOtpSchema } from "../zod/auth/verifyRegisterOtp";

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    const inputData = signupSchema.safeParse(req.body);

    if (inputData.success === false) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
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
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already in use",
      });
    }

    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already in use",
      });
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
        profile_url: `turant-news.in/${username}`, //! changes
        phone,
        password: hashedPassword,
        app_language,
        state,
        city,
        verified: false,
        role: "user",
        status: "active",
      },
    });

    await Promise.all([
      sendRegisterMailOtp(email),
      sendRegisterPhoneOtp(phone),
    ]);

    const accessToken = generateAccessToken(newUser.user_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    // Respond with success
    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    // Handle other errors
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const inputData = loginSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { identifier, password, state, city, app_language } = inputData.data;

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
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user.user_id);
    // const refreshToken = generateRefreshToken(newUser.user_id);

    // change state and city of user
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { state, city, app_language },
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        accessToken,
        // refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  const inputData = sendForgotPasswordOtpSchema.safeParse(req.body);

  if (inputData.success === false) {
    return res.status(400).json({
      message: "Validation error",
      errors: inputData.error.flatten().fieldErrors,
    });
  }

  const { email, phone, medium } = inputData.data;

  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  if (medium == "email") {
    if (!email) throw new Error("Email is required for OTP generation");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("User not found");

    // ! TODO: Send OTP to email

    await prisma.otp.create({
      data: {
        user_id: user.user_id,
        related: "forgot_password", // OTP type
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  } else if (medium == "phone") {
    if (!phone) throw new Error("Phone Number is required for OTP generation");

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) throw new Error("User not found");

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

  console.log(`Sending email OTP to ${email}: ${otp}`);
};

export const verifyForgotPasswordOtp = async (req, res) => {
  const inputData = verifyForgotPasswordOtpSchema.safeParse(req.body);

  if (inputData.success === false) {
    return res.status(400).json({
      message: "Validation error",
      errors: inputData.error.flatten().fieldErrors,
    });
  }

  const { otp, email, phone, medium, password } = inputData.data;

  let user;

  // Validate user based on the medium
  if (medium === "email") {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required for verification" });
    }

    user = await prisma.user.findUnique({
      where: { email },
    });
  } else if (medium === "phone") {
    if (!phone) {
      return res
        .status(400)
        .json({ message: "Phone number is required for verification" });
    }

    user = await prisma.user.findUnique({
      where: { phone },
    });
  } else {
    return res.status(400).json({ message: "Invalid medium" });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
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
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Check if OTP is expired
  if (new Date(otpRecord.expires_at) < new Date()) {
    return res.status(400).json({ message: "OTP has expired" });
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

  return res.json({ success: true, message: "Password updated successfully" });
};

export const verifyRegisterOtp = async (req, res) => {
  try {
    const inputData = verifyRegisterOtpSchema.safeParse(req.body);

    if (!inputData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: inputData.error.flatten().fieldErrors,
      });
    }

    const { email, phone } = inputData.data;

    // Validate Email OTP
    const emailOtpRecord = await prisma.otp.findFirst({
      where: {
        otp: email,
        related: "register_mail",
      },
    });

    if (!emailOtpRecord) {
      return res.status(400).json({ message: "Invalid or expired email OTP" });
    }

    if (new Date(emailOtpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Email OTP has expired" });
    }

    // Validate Phone OTP
    const phoneOtpRecord = await prisma.otp.findFirst({
      where: {
        otp: phone,
        related: "register_phone",
      },
    });

    if (!phoneOtpRecord) {
      return res.status(400).json({ message: "Invalid or expired phone OTP" });
    }

    if (new Date(phoneOtpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "Phone OTP has expired" });
    }

    // Mark user as verified (if both OTPs are valid)
    const userId = emailOtpRecord.user_id; // Both OTPs should belong to the same user
    const phoneUserId = phoneOtpRecord.user_id;

    if (userId !== phoneUserId) {
      return res
        .status(400)
        .json({ message: "Email and phone OTPs do not match the same user" });
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

    return res.json({
      success: true,
      message: "Both OTPs verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
