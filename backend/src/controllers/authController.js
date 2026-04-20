import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";



// Dummy user storage (Day 1 only)
let users = [];

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const {name, email, password, role } = req.body;

    if (!name||!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    //email format validation 
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       return res.status(400).json({ message: "Invalid email format" });
     }

     //check dublicate email
     const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }


    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: role || "buyer",
    };

    users.push(user);

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
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
