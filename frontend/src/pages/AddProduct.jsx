import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import "./AddProduct.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStatus({ type: "error", message: "Please select a valid image file." });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStatus({ type: "", message: "" });
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !imageFile) {
      setStatus({ type: "error", message: "Product name, price, and image are required." });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: "", message: "" });

      // 1. Upload Image to Supabase Storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("seller_product")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("seller_product")
        .getPublicUrl(filePath);

      // 3. Direct Supabase Insert (Recommended Fix for 401)
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user || JSON.parse(localStorage.getItem("user"));
      
      const { error: dbError } = await supabase
        .from("seller_product")
        .insert([
          {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image: publicUrl,
            // farmer_id: user?.id, // Optional: uncomment if farmer_id is required
          },
        ]);

      if (dbError) throw dbError;

      // Success!
      setStatus({ type: "success", message: "Product added successfully! 🌱" });
      setFormData({ name: "", price: "", description: "" });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Error adding product:", error);
      setStatus({
        type: "error",
        message: error.message || "Failed to add product. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <header className="add-product-header">
          <h1>Add New Product</h1>
          <p>List your agricultural produce on AgroMitra</p>
        </header>

        {status.message && (
          <div className={`status-msg ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Organic Basmati Rice"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Tell buyers about your product's quality, origin, etc."
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div
              className={`image-upload-zone ${imagePreview ? 'has-preview' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />

              {imagePreview ? (
                <div className="preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button type="button" className="remove-image-btn" onClick={removeImage}>
                    &times;
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <p>Click to upload product image</p>
                  <span>PNG, JPG or WebP (Max. 5MB)</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Uploading...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
