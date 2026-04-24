// let products = []; // mock DB

// ADD PRODUCT (Farmer only)
import { supabase } from "../config/supabase.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price required",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price,
          farmer_id: req.user.id,
        },
      ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({
      message: "Product added successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET PRODUCTS (Public)
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_images(image_url)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      success: true,
      products: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};