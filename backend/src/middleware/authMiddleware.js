import { supabase } from "../config/supabase.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    req.user = user; // attach supabase user data
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
