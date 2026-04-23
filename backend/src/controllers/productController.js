let products = []; // mock DB

// ADD PRODUCT (Farmer only)
export const addProduct = async (req, res) => {
  try {
    let { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // sanitize
    name = name.trim();

    const priceNum = parseFloat(price);

    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({
        message: "Invalid price",
      });
    }

    const product = {
      id: Date.now(),
      name,
      price: priceNum,
      image: req.file ? req.file.filename : null,
      farmerId: req.user.id,
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
export const getProducts = async (req, res, next) => {
  try {
    res.json({
      products,
    });
  } catch (error) {
    next(error);
  }
};
