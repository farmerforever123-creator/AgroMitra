import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  saveLoginLog,
} from "../controllers/authOtpController.js";

const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/login-log", saveLoginLog);

export default router;