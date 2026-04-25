import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // 🔥 VERY IMPORTANT (top पर होना चाहिए)

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables missing ❌");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
