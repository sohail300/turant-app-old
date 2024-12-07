import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME!;
// const REFRESH_TOKEN_EXPIRATION_TIME = process.env.REFRESH_TOKEN_EXPIRATION_TIME!;

// Generate Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Token invalid or expired
  }
};

// // Generate Refresh Token
// export const generateRefreshToken = (userId) => {
//   return jwt.sign({ userId }, JWT_SECRET, {
//     expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
//   });
// };

// // Verify Refresh Token
// export const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return null;
//   }
// };
