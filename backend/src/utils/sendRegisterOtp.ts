import { PrismaClient } from "@prisma/client";
import otpGenerator from "otp-generator";
import { transporter } from "./sendEmail";

const prisma = new PrismaClient();

export const sendRegisterMailOtp = async (email) => {
  if (!email) throw new Error("Email is required for OTP generation");

  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  // Save OTP to database
  await prisma.otp.create({
    data: {
      user_id: user.user_id,
      related: "register_mail", // OTP type
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${email}`,
    subject: 'OTP For registration',
    text: `OTP : ${otp}`
  };

  await transporter.sendMail(mailOptions)

  // Simulate sending the OTP (Replace this with an email service integration)
  console.log(`Sending email OTP to ${email}: ${otp}`);
};

export const sendRegisterPhoneOtp = async (phone) => {
  if (!phone) throw new Error("Phone Number is required for OTP generation");

  const otp = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  const user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) throw new Error("User not found");

  // Save OTP to database
  await prisma.otp.create({
    data: {
      user_id: user.user_id,
      related: "register_phone", // OTP type
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // Simulate sending the OTP (Replace this with an phone service integration)
  console.log(`Sending email OTP to ${phone}: ${otp}`);
};
