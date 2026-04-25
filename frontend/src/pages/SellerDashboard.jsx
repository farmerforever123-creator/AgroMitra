import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../components/landing.css";

/* ── helpers ─────────────────────────────────────────────────── */
function createSlug(name) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now()
  );
}

async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  if (data?.user) return data.user;
  const str = localStorage.getItem("user");
  if (!str) return null;
  try { return JSON.parse(str); } catch { return null; }
}

/* ── Toggle switch ───────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <label className="sd-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="sd-toggle-track">
        <span className="sd-toggle-thumb" />
      </span>
    </label>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [activeTab, setActiveTab] = useState("add");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock_quantity: "",
    unit: "kg", category_id: "", image_url: "",
  });

  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState({ text: "", type: "" });

  /* ── init ── */
  useEffect(() => { init(); }, []);

  async function init() {
    const u = await getCurrentUser();
    if (!u) { setMessage({ text: "Please login as seller first.", type: "error" }); return; }
    setUser(u);

    const [catRes, prodRes, ordRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("products")
        .select("*, categories(name), product_images(image_url, is_primary)")
        .eq("farmer_id", u.id)
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("*, order_items(*, products(name, product_images(image_url, is_primary)))").order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (catRes.data)  setCategories(catRes.data);
    if (prodRes.data) setProducts(prodRes.data);
    if (ordRes.data)  setOrders(ordRes.data);
  }

  /* ── form ── */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!user) { setMessage({ text: "Please login first.", type: "error" }); return; }
    if (!formData.name.trim() || !formData.price || !formData.stock_quantity) {
      setMessage({ text: "Product name, price and stock are required.", type: "error" });
      return;
    }
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      const slug = createSlug(formData.name);

      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          farmer_id: user.id,
          category_id: formData.category_id || null,
          name: formData.name.trim(),
          slug,
          description: formData.description.trim(),
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity),
          unit: formData.unit,
          is_active: true,
          is_approved: true,
        })
        .select()
        .single();

      if (productError) throw productError;

      if (formData.image_url.trim() && productData?.id) {
        const { error: imgErr } = await supabase.from("product_images").insert({
          product_id: productData.id,
          image_url: formData.image_url.trim(),
          is_primary: true,
          sort_order: 1,
        });
        if (imgErr) throw imgErr;
      }

      setMessage({ text: "✅ Product added successfully!", type: "success" });
      setFormData({ name: "", description: "", price: "", stock_quantity: "", unit: "kg", category_id: "", image_url: "" });
      const { data } = await supabase
        .from("products")
        .select("*, categories(name), product_images(image_url, is_primary)")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
    } catch (err) {
      setMessage({ text: err.message || "Product add failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  /* ── active toggle ── */
  async function toggleActive(product) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);
    if (!error) {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p)
      );
    }
  }

  /* ── logout ── */
  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/seller-login");
  }

  /* ── helpers ── */
  function getProductImage(product) {
    const primary = product.product_images?.find(i => i.is_primary);
    return primary?.image_url || product.product_images?.[0]?.image_url || null;
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setSidebarOpen(false);
    setMessage({ text: "", type: "" });
  }

  /* ── nav items ── */
  const navItems = [
    { key: "add",   label: "Add Product",  icon: "➕" },
    { key: "list",  label: "Product List",  icon: "📦" },
    { key: "orders",label: "Orders",        icon: "📋" },
  ];

  /* ════════════════════════════════════ RENDER ══════════════════ */
  return (
    <div className="sd-root">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="sd-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════ SIDEBAR ════════ */}
      <aside className={`sd-sidebar ${sidebarOpen ? "sd-sidebar--open" : ""}`}>
        <div className="sd-sidebar-logo">
          <span className="sd-logo-icon">🌱</span>
          <span className="sd-logo-text">AgroMitra</span>
        </div>

        <nav className="sd-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`sd-nav-item ${activeTab === item.key ? "sd-nav-item--active" : ""}`}
              onClick={() => switchTab(item.key)}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="sd-nav-item sd-nav-logout" onClick={handleLogout}>
          <span className="sd-nav-icon">🚪</span>
          Logout
        </button>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div className="sd-main">

        {/* ── Top bar ── */}
        <header className="sd-topbar">
          <button className="sd-hamburger" onClick={() => setSidebarOpen(o => !o)}>
            ☰
          </button>
          <div className="sd-topbar-left">
            <span className="sd-topbar-greeting">Hi! Seller</span>
            {user && (
              <span className="sd-topbar-email">
                {user.user_metadata?.full_name || user.email}
              </span>
            )}
          </div>
          <button className="sd-topbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* ── Content area ── */}
        <main className="sd-content">

          {/* ── Flash message ── */}
          {message.text && (
            <div className={`sd-flash sd-flash--${message.type}`}>
              {message.text}
            </div>
          )}

          {/* ════ TAB: ADD PRODUCT ════ */}
          {activeTab === "add" && (
            <div className="sd-card">
              <h2 className="sd-card-title">Add New Product</h2>

              <form onSubmit={handleAddProduct} className="sd-form">

                {/* Image URL row */}
                <div className="sd-form-group">
                  <label>Product Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    placeholder="Paste an image URL (e.g. from Unsplash)"
                    value={formData.image_url}
                    onChange={handleChange}
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="sd-img-preview"
                      onError={e => e.target.style.display = "none"}
                    />
                  )}
                </div>

                {/* Name */}
                <div className="sd-form-group">
                  <label>Product Name <span className="sd-required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Fresh Wheat 1kg"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="sd-form-group">
                  <label>Product Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Category */}
                <div className="sd-form-group">
                  <label>Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange}>
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price + Offer Price row */}
                <div className="sd-form-row">
                  <div className="sd-form-group">
                    <label>Product Price (₹) <span className="sd-required">*</span></label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="sd-form-group">
                    <label>Stock Quantity <span className="sd-required">*</span></label>
                    <input
                      type="number"
                      name="stock_quantity"
                      placeholder="0"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Unit */}
                <div className="sd-form-group">
                  <label>Unit</label>
                  <select name="unit" value={formData.unit} onChange={handleChange}>
                    <option value="kg">Kg</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="litre">Litre</option>
                    <option value="packet">Packet</option>
                  </select>
                </div>

                <button type="submit" className="sd-btn-primary" disabled={loading}>
                  {loading ? "Adding…" : "ADD PRODUCT"}
                </button>
              </form>
            </div>
          )}

          {/* ════ TAB: PRODUCT LIST ════ */}
          {activeTab === "list" && (
            <div className="sd-card">
              <h2 className="sd-card-title">All Products</h2>

              {products.length === 0 ? (
                <div className="sd-empty">
                  <span>📦</span>
                  <p>No products added yet. Click "Add Product" to get started.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="sd-table-wrap">
                    <table className="sd-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Selling Price</th>
                          <th>Stock</th>
                          <th>In Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div className="sd-product-cell">
                                {getProductImage(p)
                                  ? <img src={getProductImage(p)} alt={p.name} className="sd-product-thumb" />
                                  : <div className="sd-product-thumb sd-thumb-placeholder">🌾</div>
                                }
                                <span>{p.name}</span>
                              </div>
                            </td>
                            <td>{p.categories?.name || "—"}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock_quantity} {p.unit}</td>
                            <td>
                              <Toggle
                                checked={!!p.is_active}
                                onChange={() => toggleActive(p)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sd-mobile-cards">
                    {products.map(p => (
                      <div key={p.id} className="sd-mobile-card">
                        <div className="sd-mobile-card-top">
                          {getProductImage(p)
                            ? <img src={getProductImage(p)} alt={p.name} className="sd-product-thumb" />
                            : <div className="sd-product-thumb sd-thumb-placeholder">🌾</div>
                          }
                          <div>
                            <strong>{p.name}</strong>
                            <span>{p.categories?.name || "—"}</span>
                          </div>
                        </div>
                        <div className="sd-mobile-card-row">
                          <span>Price: ₹{p.price}</span>
                          <span>Stock: {p.stock_quantity} {p.unit}</span>
                          <Toggle checked={!!p.is_active} onChange={() => toggleActive(p)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════ TAB: ORDERS ════ */}
          {activeTab === "orders" && (
            <div className="sd-card">
              <h2 className="sd-card-title">Orders List</h2>

              {orders.length === 0 ? (
                <div className="sd-empty">
                  <span>📋</span>
                  <p>No orders yet. Your orders will appear here once buyers place them.</p>
                </div>
              ) : (
                <div className="sd-orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="sd-order-card">
                      {/* Items */}
                      <div className="sd-order-items">
                        {order.order_items?.map((item, idx) => {
                          const img = item.products?.product_images?.find(i => i.is_primary)?.image_url
                            || item.products?.product_images?.[0]?.image_url;
                          return (
                            <div key={idx} className="sd-order-item">
                              {img
                                ? <img src={img} alt="" className="sd-product-thumb" />
                                : <div className="sd-product-thumb sd-thumb-placeholder">🌾</div>
                              }
                              <span>{item.products?.name || "Product"} × {item.quantity}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Meta */}
                      <div className="sd-order-meta">
                        <div className="sd-order-address">
                          {order.shipping_address && <p>{order.shipping_address}</p>}
                          {order.phone && <p>{order.phone}</p>}
                        </div>
                        <div className="sd-order-price">
                          ₹{order.total_amount ?? "—"}
                        </div>
                        <div className="sd-order-info">
                          {order.payment_method && <p>Method: {order.payment_method}</p>}
                          {order.created_at && (
                            <p>Date: {new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                          )}
                          {order.payment_status && (
                            <p>Payment: <span className={`sd-status sd-status--${order.payment_status?.toLowerCase()}`}>
                              {order.payment_status}
                            </span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}