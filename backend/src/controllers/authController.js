<<<<<<< HEAD
=======
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { generateToken } from "../utils/generateToken.js";
// import { OAuth2Client } from "google-auth-library";
// import { sendEmail } from "../utils/sendEmail.js";
// import { generateOTP } from "../utils/generateOTP.js";




// // Dummy user storage (Day 1 only)
// let users = [
// //   {
// //   id,
// //   email,
// //   password,
// //   role,
// //   isVerified: false,
// //   otp: "123456",
// //   otpExpiry: Date
// // }

// ];

// // REGISTER
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields required" });

//     }

//     const passwordRegex =
//       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must contain letter, number & special character"
//       });
//     }

//     // email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     // duplicate check
//     const existingUser = users.find(
//       (u) => u.email.toLowerCase() === email.toLowerCase()
//     );

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }
//     // password optional (store if given)
//     const hashedPassword = await bcrypt.hash(password, 10);

    
//     // generate OTP
//     const otp = generateOTP();

//     const user = {
//       id: Date.now(),
//       name,
//       email,
//       password: hashedPassword,
//       role: "buyer",

//       // OTP fields
//       isVerified: false,
//       otp,
//       otpExpiry: Date.now() + 5 * 60 * 1000, // 5 min
//       otpAttempts: 0,
//     };

//     users.push(user);

//     // send OTP email
//     await sendEmail(email, otp);

//     res.status(201).json({
//       message: "OTP sent to email. Please verify before login.",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * =========================
//  * VERIFY OTP
//  * =========================
//  */
// export const verifyOTP = (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = users.find((u) => u.email === email);

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // check attempts (security)
//     if (user.otpAttempts >= 5) {
//       return res.status(429).json({
//         message: "Too many attempts. Try again later.",
//       });
//     }

//     // check expiry
//     if (Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     // wrong OTP
//     if (user.otp !== otp) {
//       user.otpAttempts += 1;
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // success
//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;
//     user.otpAttempts = 0;

//     res.json({
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // LOGIN
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = users.find((u) => u.email === email);
//      console.log("User found:", user);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!user.isVerified) {
//       return res.status(401).json({
//         message: "Please verify your email first",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({
//       message: "Login successful",
//       token: generateToken(user),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // GOOGLE LOGIN
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// export const googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body; // frontend se aayega

//     // 1 VERIFY GOOGLE TOKEN
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     const { email, name, sub } = payload; 
//     // sub = Google unique ID

//     // 2 CHECK USER EXISTS OR NOT
//     let user = users.find((u) => u.email === email);

//     // 3️ IF NOT EXISTS → CREATE USER
//     if (!user) {
//       user = {
//         id: Date.now(),
//         name,
//         email,
//         password: null, // Google login has no password
//         role: "buyer",
//         googleId: sub,
//         isVerified: true,
//       };

//       users.push(user);
//     }

//     // 4️ GENERATE YOUR JWT TOKEN
//     const jwtToken = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       },
//       "secretkey",
//       { expiresIn: "7d" }
//     );

//     // 5️ RESPONSE
//     res.json({
//       message: "Google login successful",
//       token: jwtToken,
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     res.status(401).json({
//       message: "Invalid Google token",
//       error: error.message,
//     });
//   }
// };


>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";
import { supabase } from "../config/supabase.js";

<<<<<<< HEAD
=======
// Dummy storage
let users = [];

>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
/**
 * =========================
 * COMMON VALIDATION FUNCTION
 * =========================
 */
const validateUser = (name, email, password) => {
  if (!name || !email || !password) {
    return "All fields required";
  }

<<<<<<< HEAD
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
=======
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

  if (!passwordRegex.test(password)) {
    return "Password must contain letter, number & special character";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return null;
};

/**
 * =========================
<<<<<<< HEAD
 * REGISTER USER (Buyer or Seller)
=======
 * REGISTER BUYER
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
 * =========================
 */
export const registerUser = async (req, res) => {
  try {
<<<<<<< HEAD
    const { name, email, password, role, full_name } = req.body;
    
    const userName = name || full_name;

    const errorMsg = validateUser(userName, email, password);
=======
    const { name, email, password } = req.body;

    const errorMsg = validateUser(name, email, password);
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

<<<<<<< HEAD
    const assignedRole = role === "seller" || role === "farmer" ? "seller" : "buyer";

=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    // 🔍 CHECK DUPLICATE FROM DB
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
<<<<<<< HEAD
      // If already verified
      if (existingUser.is_verified) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        // Delete unverified existing user to allow re-registration
        await supabase.from("users").delete().eq("email", email);
      }
=======
      return res.status(400).json({
        message: "Email already registered",
      });
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 OTP GENERATE
    const otp = generateOTP();
<<<<<<< HEAD
    console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);
=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

    // 💾 SAVE IN DATABASE
    const { error } = await supabase.from("users").insert([
      {
<<<<<<< HEAD
        name: userName,
        email,
        password: hashedPassword,
        role: assignedRole,
        is_verified: false,
        otp,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
=======
        name,
        email,
        password: hashedPassword,
        role: "buyer", // fixed role
        is_verified: false,
        otp,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
        otp_attempts: 0,
      },
    ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

<<<<<<< HEAD
    try {
      await sendEmail(email, otp);
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      return res.status(500).json({ message: "Registration successful, but failed to send OTP email. Please check your SMTP configuration." });
    }

    res.status(201).json({
      message: "Registered successfully. Please verify OTP sent to your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * REGISTER SELLER (Alias)
 * =========================
 */
export const registerSeller = async (req, res) => {
  req.body.role = "seller";
  return registerUser(req, res);
};

/**
 * =========================
 * VERIFY OTP
 * =========================
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const { data: user, error } = await supabase
=======
    await sendEmail(email, otp);

    res.status(201).json({
      message: "Buyer registered. Verify OTP",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * =========================
 * REGISTER SELLER
 * =========================
 */
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errorMsg = validateUser(name, email, password);
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

    // 🔍 CHECK DUPLICATE FROM DB
    const { data: existingUser } = await supabase
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

<<<<<<< HEAD
    if (error || !user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp_attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts. Please register again." });
    }

    if (new Date() > new Date(user.otp_expiry)) {
=======
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // 💾 SAVE SELLER
    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role: "seller", // seller role
        is_verified: false,
        otp,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
        otp_attempts: 0,
      },
    ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    await sendEmail(email, otp);

    res.status(201).json({
      message: "Seller registered. Verify OTP",
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

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Try later",
      });
    }

    if (Date.now() > user.otpExpiry) {
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
<<<<<<< HEAD
      await supabase.from("users").update({ otp_attempts: user.otp_attempts + 1 }).eq("email", email);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Success
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_verified: true,
        otp: null,
        otp_expiry: null,
        otp_attempts: 0,
      })
      .eq("email", email);

    if (updateError) {
      throw updateError;
    }
=======
      user.otpAttempts += 1;
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

    res.json({ message: "Email verified successfully" });

  } catch (error) {
<<<<<<< HEAD
    console.error("Verify OTP error:", error);
=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

<<<<<<< HEAD
=======
    // 🔍 DB से user fetch करो
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

<<<<<<< HEAD
    if (error || !user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

=======
    // ❌ user नहीं मिला
    if (error || !user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🔒 email verify check
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // 🔐 password compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // ✅ token generate
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
<<<<<<< HEAD
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

=======
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
/**
 * =========================
 * GOOGLE LOGIN
 * =========================
 */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

<<<<<<< HEAD
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google Client ID not configured" });
    }

=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

<<<<<<< HEAD
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      // Create user
      const { data: newUser, error } = await supabase.from("users").insert([
        {
          name,
          email,
          password: null,
          role: "buyer",
          is_verified: true, // Google accounts are implicitly verified
        },
      ]).select().single();
      
      if (error) throw error;
      user = newUser;
    }

    const jwtToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
=======
    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        id: Date.now(),
        name,
        email,
        password: null,
        role: "buyer",
        googleId: sub,
        isVerified: true,
      };

      users.push(user);
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET, // ✅ FIXED
      { expiresIn: "7d" }
    );
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

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
<<<<<<< HEAD
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google token", error: error.message });
  }
};
=======
    res.status(401).json({
      message: "Invalid Google token",
      error: error.message,
    });
  }
};

>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
