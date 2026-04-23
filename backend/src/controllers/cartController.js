 export let carts = [];

// ADD TO CART
export const addToCart = (req, res, next) => {
  try {
    const userId = req.user.id;
    let { productId, name, price, quantity } = req.body;

    if (!productId || !name || !price || quantity === undefined) {
      return res.status(400).json({ message: "All fields required" });
    }

    const priceNum = parseFloat(price);
    const qtyNum = parseInt(quantity, 10);

    if (isNaN(priceNum) || priceNum < 0 || isNaN(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({ message: "Invalid price or quantity" });
    }

    name = String(name).trim();
    productId = String(productId).trim();

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
      existingItem.quantity += qtyNum;
    } else {
      cart.items.push({ productId, name, price: priceNum, quantity: qtyNum });
    }

    res.json({ message: "Added to cart", cart });
  } catch (error) {
    next(error);
  }
};

// GET CART
export const getCart = (req, res, next) => {
  try {
    const cart = carts.find((c) => c.userId === req.user.id);

    res.json(cart || { items: [] });
  } catch (error) {
    next(error);
  }
};

// REMOVE ITEM
export const removeFromCart = (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = carts.find((c) => c.userId === req.user.id);

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== String(productId).trim()
    );

    res.json({ message: "Item removed", cart });
  } catch (error) {
    next(error);
  }
};
