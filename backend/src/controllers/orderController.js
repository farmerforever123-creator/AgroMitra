import { carts } from "./cartController.js"; // share carts
let orders = [];

// PLACE ORDER
export const placeOrder = (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = carts.find((c) => c.userId === userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      id: Date.now(),
      userId,
      items: cart.items,
      totalAmount,
      status: "PLACED",
    };

    orders.push(order);

    // clear cart
    cart.items = [];

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
