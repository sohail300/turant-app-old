import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signupSchema } from "../zod/signup";
import {
  sendRegisterMailOtp,
  sendRegisterPhoneOtp,
} from "../utils/sendRegisterOtp";
import { loginSchema } from "../zod/login";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtMethods";
import { sendForgotPasswordOtpSchema } from "../zod/sendForgotPasswordOtp";
import otpGenerator from "otp-generator";

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
    const refreshToken = generateRefreshToken(newUser.user_id);

    // Respond with success
    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser.user_id,
      accessToken,
      refreshToken,
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

    const { identifier, password } = inputData.data;

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

    // Generate a token (e.g., JWT token) or session here (not shown for brevity)
    // const token = generateJwtToken(user);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        // Add more user info to be returned if needed
      },
      // token: token,  // Return token if needed
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

export const verifyRegisterOtp = (req, res) => {
  return res.json({ success: true });
};

export const verifyForgotPasswordOtp = (req, res) => {
  return res.json({ success: true });
};

export const logout = (req, res) => {
  res.send("Logged out");
};
