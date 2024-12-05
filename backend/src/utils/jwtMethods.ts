import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret"; // Use a strong secret key in production
const JWT_EXPIRATION_TIME = "15m"; // Access token expiration time
const REFRESH_TOKEN_EXPIRATION_TIME = "7d"; // Refresh token expiration time

// Generate Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Token invalid or expired
  }
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
