import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/db-test", async (req, res) => {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supabase connected successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;