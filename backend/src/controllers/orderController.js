 // share carts
// let orders = [];

// PLACE ORDER
import { supabase } from "../config/supabase.js";

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 🛒 fetch cart
    const { data: cartItems, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (cartError) {
      return res.status(400).json({
        message: cartError.message,
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // 🔍 get product prices
    const productIds = cartItems.map((item) => item.product_id);

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (productError) {
      return res.status(400).json({
        message: productError.message,
      });
    }

    // 🧠 create map
    const priceMap = {};
    products.forEach((p) => {
      priceMap[p.id] = p.price;
    });

    // 💰 calculate total securely
    let totalAmount = 0;

    for (const item of cartItems) {
      const price = priceMap[item.product_id];

      if (!price) {
        return res.status(400).json({
          message: `Invalid product: ${item.product_id}`,
        });
      }

      totalAmount += price * item.quantity;
    }

    // 📦 create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_amount: totalAmount,
          status: "CREATED",
        },
      ])
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({
        message: orderError.message,
      });
    }

    // 🧹 clear cart
    await supabase.from("cart").delete().eq("user_id", userId);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    next(error);
  }
};


// GET ORDERS
export const getOrders = (req, res, next) => {
  try {
    const userOrders = orders.filter(
      (o) => o.userId === req.user.id
    );

    res.json({ orders: userOrders });
  } catch (error) {
    next(error);
  }
};
