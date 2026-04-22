let products = []; // mock DB

// ADD PRODUCT (Farmer only)
export const addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const product = {
      id: Date.now(),
      name,
      price,
      image: req.file ? req.file.filename : null,
      sellerId: req.user.id,
    };

    products.push(product);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PRODUCTS (Public)
export const getProducts = async (req, res) => {
  res.json({
    products,
  });
};
