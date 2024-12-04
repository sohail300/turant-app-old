import { Router } from "express";
import {
  login,
  logout,
  sendOtp,
  signup,
  verifyForgotPasswordOtp,
  verifyRegisterOtp,
} from "../controllers/auth";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/send-otp", sendOtp);

router.post("/verify-register-otp", verifyRegisterOtp);

router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

router.post("/logout", logout);

export default router;
