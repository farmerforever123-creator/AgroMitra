import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // 🔥 VERY IMPORTANT (top पर होना चाहिए)

const supabaseUrl = process.env.SUPABASE_URL;
<<<<<<< HEAD
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
=======
const supabaseKey = process.env.SUPABASE_KEY;

>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env variables missing ❌");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
<<<<<<< HEAD

=======
>>>>>>> 73b94e7464bcb9c717fe7abd6e3e498f3165aa82
