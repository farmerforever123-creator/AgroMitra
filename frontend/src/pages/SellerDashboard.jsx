import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../components/landing.css";

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    unit: "kg",
    category_id: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSellerData();
  }, []);

  async function loadSellerData() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      setMessage("Please login as seller first.");
      return;
    }

    setUser(userData.user);

    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    setCategories(categoryData || []);

    await fetchProducts(userData.user.id);
  }

  async function fetchProducts(userId) {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    if (!formData.name || !formData.price || !formData.stock_quantity) {
      setMessage("Product name, price and stock are required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          seller_id: user.id,
          category_id: formData.category_id || null,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity),
          unit: formData.unit,
          status: "active",
        })
        .select()
        .single();

      if (productError) {
        throw productError;
      }

      if (formData.image_url && productData?.id) {
        await supabase.from("product_images").insert({
          product_id: productData.id,
          image_url: formData.image_url,
          is_primary: true,
        });
      }

      setMessage("Product added successfully.");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        unit: "kg",
        category_id: "",
        image_url: "",
      });

      await fetchProducts(user.id);
    } catch (error) {
      setMessage(error.message || "Product add failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="seller-dashboard-page">
      <div className="seller-dashboard-container">
        <div className="seller-dashboard-header">
          <span className="seller-dashboard-badge">Seller Panel</span>
          <h1>Sell Your Products</h1>
          <p>
            Add your agricultural products and manage your listings from one
            place.
          </p>
        </div>

        {message && <div className="seller-dashboard-message">{message}</div>}

        <div className="seller-dashboard-grid">
          <div className="seller-dashboard-card">
            <h2>Add New Product</h2>

            <form onSubmit={handleAddProduct} className="seller-product-form">
              <div className="seller-form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Example: Fresh Wheat"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="seller-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Write product details"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="₹ Price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="seller-form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    placeholder="Quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    <option value="kg">Kg</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>

                <div className="seller-form-group">
                  <label>Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="seller-form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  placeholder="Paste product image URL"
                  value={formData.image_url}
                  onChange={handleChange}
                />
              </div>

              <button className="seller-product-btn" disabled={loading}>
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="seller-dashboard-card">
            <h2>My Products</h2>

            <div className="seller-products-list">
              {products.length === 0 ? (
                <p className="seller-empty-text">No products added yet.</p>
              ) : (
                products.map((product) => (
                  <div className="seller-product-item" key={product.id}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        ₹{product.price} / {product.unit}
                      </p>
                      <span>
                        Stock: {product.stock_quantity} |{" "}
                        {product.categories?.name || "No Category"}
                      </span>
                    </div>

                    <strong>{product.status}</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}