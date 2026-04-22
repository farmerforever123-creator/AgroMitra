 export let carts = [];

// ADD TO CART
export const addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, name, price, quantity } = req.body;

  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({ message: "All fields required" });
  }

  let cart = carts.find((c) => c.userId === userId);

  if (!cart) {
    cart = { userId, items: [] };
    carts.push(cart);
  }

  // check if product already exists
  const existingItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, quantity });
  }

  res.json({ message: "Added to cart", cart });
};

// GET CART
export const getCart = (req, res) => {
  const cart = carts.find((c) => c.userId === req.user.id);

  res.json(cart || { items: [] });
};

// REMOVE ITEM
export const removeFromCart = (req, res) => {
  const { productId } = req.body;

  let cart = carts.find((c) => c.userId === req.user.id);

  if (!cart) {
    return res.status(400).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.productId !== productId
  );

  res.json({ message: "Item removed", cart });
};
