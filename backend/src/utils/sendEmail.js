<<<<<<< HEAD
import { transporter } from "../config/mailer.js";

export const sendEmail = async (email, otp) => {
  let info = await transporter.sendMail({
    from: `"AgroMitra" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "AgroMitra OTP Verification",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `<h3>Welcome to AgroMitra!</h3><p>Your OTP for registration is <b>${otp}</b>.</p><p>It is valid for 5 minutes.</p>`,
  });
  console.log("Email sent successfully");
};

export const sendOtpEmail = sendEmail;
=======
import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  


  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
};
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
