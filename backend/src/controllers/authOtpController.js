import { supabaseAdmin } from "../config/supabaseAdmin.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendRegisterOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from("otp_verifications")
      .update({ is_used: true })
      .eq("email", email)
      .eq("purpose", "register");

    const { error } = await supabaseAdmin.from("otp_verifications").insert({
      email,
      otp_code: otp,
      purpose: "register",
      expires_at: expiresAt,
      is_used: false,
    });

    if (error) throw error;

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "OTP send failed" });
  }
}

export async function verifyRegisterOtp(req, res) {
  try {
    const { full_name, email, phone, password, role, otp, gst_number, gst_verified, business_name } = req.body;
    console.log("verifyRegisterOtp received body:", req.body);

    if (!full_name || !email || !password || !role || !otp) {
      return res.status(400).json({ message: "All required fields are missing" });
    }

    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("purpose", "register")
      .eq("is_used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          phone,
          role,
        },
      });

    if (authError) {
      console.error("Supabase Admin createUser authError:", authError);
      throw authError;
    }

    const userId = authData.user.id;

    const profileData = {
      id: userId,
      full_name,
      email,
      phone,
      role,
      is_verified: true,
    };

    if (role === "farmer" && gst_number) {
      profileData.gst_number = gst_number;
      profileData.gst_verified = gst_verified || false;
      profileData.business_name = business_name || null;
      profileData.gst_verified_at = gst_verified ? new Date().toISOString() : null;
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(profileData);

    if (profileError) {
      console.error("Supabase Admin profiles upsert profileError:", profileError);
      throw profileError;
    }

    await supabaseAdmin
      .from("otp_verifications")
      .update({ is_used: true })
      .eq("id", otpRecord.id);

    res.status(201).json({
      message: "Registration successful",
      user: authData.user,
    });
  } catch (error) {
    console.error("verifyRegisterOtp error catch block:", error);
    res.status(500).json({ message: error?.message || "Registration failed" });
  }
}

export async function saveLoginLog(req, res) {
  try {
    const { user_id, email, role } = req.body;

    if (!user_id || !email || !role) {
      return res.status(400).json({ message: "Login log data missing" });
    }

    const { error } = await supabaseAdmin.from("login_logs").insert({
      user_id,
      email,
      role,
    });

    if (error) throw error;

    res.json({ message: "Login saved" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login log failed" });
  }
}