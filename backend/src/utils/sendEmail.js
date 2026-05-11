// import { transporter } from "../config/mailer.js";

// export const sendEmail = async (email, otp) => {
//   let info = await transporter.sendMail({
//     from: `"AgroMitra" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: "AgroMitra OTP Verification",
//     text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
//     html: `<h3>Welcome to AgroMitra!</h3><p>Your OTP for registration is <b>${otp}</b>.</p><p>It is valid for 5 minutes.</p>`,
//   });
//   console.log("Email sent successfully");
// };

// export const sendOtpEmail = sendEmail;
import { transporter, verifyMailer } from "../config/mailer.js";

export const sendEmail = async (email, otp) => {
  try {
    await verifyMailer();

    const info = await transporter.sendMail({
      from: `"AgroMitra" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "AgroMitra OTP Verification",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome to AgroMitra</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("OTP email error:", error.message);

    if (error.code === "ENETUNREACH") {
      throw new Error("SMTP network error. Backend restart karo.");
    }

    if (error.code === "EAUTH") {
      throw new Error("SMTP auth failed. Gmail App Password use karo.");
    }

    throw error;
  }
};

export const sendOtpEmail = sendEmail;