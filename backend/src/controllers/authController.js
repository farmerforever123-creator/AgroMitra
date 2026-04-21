import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";




// Dummy user storage (Day 1 only)
let users = [
//   {
//   id,
//   email,
//   password,
//   role,
//   isVerified: false,
//   otp: "123456",
//   otpExpiry: Date
// }

];

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // duplicate check
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // password optional (store if given)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    
    // generate OTP
    const otp = generateOTP();

    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",

      // OTP fields
      isVerified: false,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
      otpAttempts: 0,
    };

    users.push(user);

    // send OTP email
    await sendEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify before login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * VERIFY OTP
 * =========================
 */
export const verifyOTP = (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check attempts (security)
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Try again later.",
      });
    }

    // check expiry
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // wrong OTP
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // success
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GOOGLE LOGIN
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // frontend se aayega

    // 1 VERIFY GOOGLE TOKEN
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, sub } = payload; 
    // sub = Google unique ID

    // 2 CHECK USER EXISTS OR NOT
    let user = users.find((u) => u.email === email);

    // 3️ IF NOT EXISTS → CREATE USER
    if (!user) {
      user = {
        id: Date.now(),
        name,
        email,
        password: null, // Google login has no password
        role: "buyer",
        googleId: sub,
      };

      users.push(user);
    }

    // 4️ GENERATE YOUR JWT TOKEN
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    // 5️ RESPONSE
    res.json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(401).json({
      message: "Invalid Google token",
      error: error.message,
    });
  }
};
