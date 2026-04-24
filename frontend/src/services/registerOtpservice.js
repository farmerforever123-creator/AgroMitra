const USE_BACKEND_OTP = import.meta.env.VITE_USE_BACKEND_OTP === "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendRegisterOtp = async (payload) => {
  if (USE_BACKEND_OTP) {
    const res = await fetch(`${API_BASE_URL}/auth/register/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "OTP send failed");
    }

    return data;
  }

  const otp = generateOtp();

  sessionStorage.setItem(
    "register_otp_data",
    JSON.stringify({
      otp,
      user: payload,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })
  );

  return {
    success: true,
    message: "OTP sent successfully",
    devOtp: otp,
  };
};

export const verifyRegisterOtp = async (email, otp) => {
  if (USE_BACKEND_OTP) {
    const res = await fetch(`${API_BASE_URL}/auth/register/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    return data;
  }

  const saved = JSON.parse(sessionStorage.getItem("register_otp_data"));

  if (!saved) {
    throw new Error("OTP expired. Please register again.");
  }

  if (Date.now() > saved.expiresAt) {
    sessionStorage.removeItem("register_otp_data");
    throw new Error("OTP expired. Please resend OTP.");
  }

  if (saved.user.email !== email || saved.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  sessionStorage.removeItem("register_otp_data");

  return {
    success: true,
    user: saved.user,
  };
};