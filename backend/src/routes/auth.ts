import { Router } from "express";
import {
  login,
  logout,
  signup,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  verifyRegisterOtp,
} from "../controllers/auth";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/send-forgot-password-otp", sendForgotPasswordOtp);

router.post("/verify-register-otp", authenticate, verifyRegisterOtp);

router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

export default router;
