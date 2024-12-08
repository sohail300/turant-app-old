import { Router } from "express";
import {
  login,
  signup,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "../controllers/auth";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/send-forgot-password-otp", sendForgotPasswordOtp);

router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

router.get("/send-register-otp", authenticate, sendRegisterOtp);

router.post("/verify-register-otp", authenticate, verifyRegisterOtp);

export default router;
