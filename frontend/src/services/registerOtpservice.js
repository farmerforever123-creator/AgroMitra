const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const sendRegisterOtp = async (payload) => {
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
};

export const verifyRegisterOtp = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/auth/register/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "OTP verification failed");
  }

  return data;
};