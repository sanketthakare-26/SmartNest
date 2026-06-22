import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import useFetch from "../../hooks/useFetch";
import api from "../../lib/api";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import {
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  Tag,
  ClipboardList,
  Upload,
  LogOut,
  CheckCircle,
  AlertCircle,
  Inbox,
  Lock,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  // Tab State: 'products' | 'enquiries' | 'categories_brands'
  const [activeTab, setActiveTab] = useState("products");

  // Auth Guard: If not authenticated, redirect
  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    }
  }, [user, navigate]);

  // Data fetching
  const { data: productsData, refetch: refetchProducts } = useFetch("/products?limit=100");
  const { data: enquiriesData, refetch: refetchEnquiries } = useFetch("/enquiries");
  const { data: categoriesData, refetch: refetchCategories } = useFetch("/categories");
  const { data: brandsData, refetch: refetchBrands } = useFetch("/brands");

  // Form toggles
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [showCatForm, setShowCatForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);

  // Form States
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    featured: false,
    inStock: true,
  });
  const [productImages, setProductImages] = useState([]);
  const [productSpecs, setProductSpecs] = useState([{ key: "", value: "" }]);

  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [categoryImage, setCategoryImage] = useState(null);

  const [brandForm, setBrandForm] = useState({ name: "", description: "" });
  const [brandLogo, setBrandLogo] = useState(null);

  // Status/Error Feedback
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  if (!user) return <Loader />;

  // Trigger feedback
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  // Log out
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Add key-val spec rows
  const handleAddSpecRow = () => {
    setProductSpecs([...productSpecs, { key: "", value: "" }]);
  };

  const handleRemoveSpecRow = (idx) => {
    setProductSpecs(productSpecs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx, field, val) => {
    const updated = [...productSpecs];
    updated[idx][field] = val;
    setProductSpecs(updated);
  };

  // Submit Product Form (Create / Update)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    formData.append("brand", productForm.brand);
    formData.append("featured", productForm.featured);
    formData.append("inStock", productForm.inStock);

    // Filter blank specifications
    const cleanSpecs = productSpecs.filter((s) => s.key.trim() !== "");
    formData.append("specifications", JSON.stringify(cleanSpecs));

    // Append multiple files
    for (let i = 0; i < productImages.length; i++) {
      formData.append("images", productImages[i]);
    }

    try {
      if (editProductId) {
        await api.put(`/products/${editProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showFeedback("success", "Product updated successfully!");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showFeedback("success", "Product created successfully!");
      }
      // Reset
      setProductForm({ name: "", description: "", price: "", category: "", brand: "", featured: false, inStock: true });
      setProductImages([]);
      setProductSpecs([{ key: "", value: "" }]);
      setEditProductId(null);
      setShowProductForm(false);
      refetchProducts();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || err.message || "Failed to save product.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      showFeedback("success", "Product deleted successfully");
      refetchProducts();
    } catch (err) {
      showFeedback("error", "Failed to delete product.");
    }
  };

  // Trigger edit setup
  const handleEditProductClick = (prod) => {
    setEditProductId(prod._id);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category?._id || "",
      brand: prod.brand?._id || "",
      featured: prod.featured,
      inStock: prod.inStock,
    });
    setProductSpecs(prod.specifications.length > 0 ? prod.specifications : [{ key: "", value: "" }]);
    setShowProductForm(true);
  };

  // Update Enquiry Status (Resolved)
  const handleResolveEnquiry = async (id) => {
    try {
      await api.put(`/enquiries/${id}`, { status: "Resolved" });
      showFeedback("success", "Enquiry marked as Resolved");
      refetchEnquiries();
    } catch (err) {
      showFeedback("error", "Failed to resolve enquiry.");
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api.delete(`/enquiries/${id}`);
      showFeedback("success", "Enquiry log removed");
      refetchEnquiries();
    } catch (err) {
      showFeedback("error", "Failed to delete enquiry.");
    }
  };

  // Submit Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("name", categoryForm.name);
    formData.append("description", categoryForm.description);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showFeedback("success", "Category created!");
      setCategoryForm({ name: "", description: "" });
      setCategoryImage(null);
      setShowCatForm(false);
      refetchCategories();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Submit Brand
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("name", brandForm.name);
    formData.append("description", brandForm.description);
    if (brandLogo) {
      formData.append("logo", brandLogo);
    }

    try {
      await api.post("/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showFeedback("success", "Brand created!");
      setBrandForm({ name: "", description: "" });
      setBrandLogo(null);
      setShowBrandForm(false);
      refetchBrands();
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to create brand");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Lock className="text-primary w-7 h-7" />
            <span>Admin Center</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Logged in as {user.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm" className="text-red-400 border-red-500/20 hover:bg-red-500/10">
          <LogOut size={16} className="mr-2" />
          <span>Exit Dashboard</span>
        </Button>
      </div>

      {/* Global Feedback */}
      {feedback.message && (
        <div className={`p-4 rounded-xl border flex items-start gap-2 text-sm mb-6 ${
          feedback.type === "success"
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-900 pb-4 mb-8">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "products" ? "bg-primary text-dark" : "text-gray-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <FolderOpen size={16} />
          <span>Products</span>
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "enquiries" ? "bg-primary text-dark" : "text-gray-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <ClipboardList size={16} />
          <span>Enquiries ({enquiriesData?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab("categories_brands")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "categories_brands" ? "bg-primary text-dark" : "text-gray-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Tag size={16} />
          <span>Categories & Brands</span>
        </button>
      </div>

      {/* PRODUCT MANAGEMENT TAB */}
      {activeTab === "products" && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Device Directory</h3>
            {!showProductForm && (
              <Button onClick={() => { setShowProductForm(true); setEditProductId(null); }} variant="primary" size="sm">
                <Plus size={16} className="mr-1.5" />
                <span>Add Product</span>
              </Button>
            )}
          </div>

          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="glass-card p-6 rounded-2xl border border-slate-900 flex flex-col gap-6 mb-8">
              <h4 className="text-lg font-bold text-white border-b border-slate-900 pb-3">
                {editProductId ? "Edit Smart Device" : "Create New Smart Device"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400">Device Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    placeholder="Nest Hub Console"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                    placeholder="299"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400">Category</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-gray-300 focus:outline-none"
                  >
                    <option value="">Choose category...</option>
                    {categoriesData?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400">Brand / Maker</label>
                  <select
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-gray-300 focus:outline-none"
                  >
                    <option value="">Choose brand...</option>
                    {brandsData?.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6 items-center mt-6">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="accent-primary"
                    />
                    <span>Featured Hero Device</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="accent-primary"
                    />
                    <span>In Stock</span>
                  </label>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-xs font-semibold text-gray-400">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none resize-none"
                    placeholder="Enter details..."
                  />
                </div>

                {/* Images Upload */}
                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-xs font-semibold text-gray-400">Upload Product Images (Max 5)</label>
                  <div className="border-2 border-dashed border-slate-850 hover:border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/20">
                    <Upload className="text-gray-500 w-8 h-8" />
                    <span className="text-xs text-gray-400">Drag files here or click to select files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setProductImages(Array.from(e.target.files))}
                      className="mt-1 text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-850 file:text-gray-300 hover:file:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Technical Specifications Specs */}
                <div className="flex flex-col gap-3 md:col-span-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400">Specifications (Key / Value)</label>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      + Add Row
                    </button>
                  </div>

                  {productSpecs.map((spec, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="e.g. Battery Life"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                        className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none w-1/2"
                      />
                      <input
                        type="text"
                        placeholder="e.g. 12 Hours"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none w-1/2"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="text-red-400 hover:text-red-300 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-900">
                <Button
                  onClick={() => { setShowProductForm(false); setEditProductId(null); }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitLoading}
                >
                  {editProductId ? "Save Changes" : "Publish Device"}
                </Button>
              </div>
            </form>
          )}

          {/* Catalog grid table view */}
          <div className="border border-slate-900 rounded-2xl overflow-hidden glass">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Brand</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-sm">
                {productsData?.products?.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/10">
                    <td className="py-3 px-5 text-white font-semibold">{p.name}</td>
                    <td className="py-3 px-5 text-gray-400">{p.category?.name || "-"}</td>
                    <td className="py-3 px-5 text-gray-400">{p.brand?.name || "-"}</td>
                    <td className="py-3 px-5 text-primary font-bold">${p.price}</td>
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-1.5 bg-slate-905 border border-slate-850 hover:border-primary/20 text-gray-400 hover:text-primary rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-1.5 bg-slate-905 border border-slate-850 hover:border-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!productsData?.products?.length && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                      No devices published in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ENQUIRIES TAB */}
      {activeTab === "enquiries" && (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Customer Enquiries</h3>

          <div className="flex flex-col gap-4">
            {enquiriesData?.map((enq) => (
              <div
                key={enq._id}
                className="glass-card p-6 rounded-2xl border border-slate-900 flex flex-col gap-4 text-left relative"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-white font-bold text-base">{enq.name}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>{enq.email}</span>
                      <span>{enq.phone}</span>
                      <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      enq.status === "Resolved"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                </div>

                {/* Linked Device */}
                {enq.product && (
                  <div className="bg-slate-950/45 px-4 py-2.5 rounded-lg border border-slate-900 text-xs w-fit">
                    <span className="text-gray-500">Interested in: </span>
                    <span className="text-primary font-semibold">{enq.product.name}</span>
                    <span className="text-gray-400 font-bold ml-1.5">${enq.product.price}</span>
                  </div>
                )}

                {/* Message */}
                <div className="text-sm text-gray-300 bg-slate-950/20 p-4 rounded-xl border border-slate-900/50 leading-relaxed italic">
                  "{enq.message}"
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900/60">
                  {enq.status !== "Resolved" && (
                    <Button onClick={() => handleResolveEnquiry(enq._id)} variant="outline" size="sm" className="text-green-400 border-green-500/10 hover:bg-green-500/10">
                      Mark Resolved
                    </Button>
                  )}
                  <Button onClick={() => handleDeleteEnquiry(enq._id)} variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
                    <Trash2 size={14} className="mr-1.5" />
                    <span>Delete log</span>
                  </Button>
                </div>
              </div>
            ))}

            {!enquiriesData?.length && (
              <div className="flex flex-col items-center justify-center p-16 bg-slate-950/20 border border-slate-900 rounded-2xl text-center gap-3">
                <Inbox className="text-gray-600 w-10 h-10" />
                <p className="text-gray-500 italic text-sm">No customer enquiries received yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIES & BRANDS TAB */}
      {activeTab === "categories_brands" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Categories Manager */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Categories</h3>
              {!showCatForm && (
                <button
                  onClick={() => setShowCatForm(true)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  + Create Category
                </button>
              )}
            </div>

            {showCatForm && (
              <form onSubmit={handleCategorySubmit} className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white">Create Category</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none"
                    placeholder="Lighting & Ambience"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Description</label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none resize-none"
                    placeholder="Short description..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Category Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCategoryImage(e.target.files[0])}
                    className="text-xs text-gray-400"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCatForm(false)}
                    className="text-xs text-gray-400 hover:text-white px-2"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="sm" loading={submitLoading}>
                    Save Category
                  </Button>
                </div>
              </form>
            )}

            <div className="border border-slate-900 rounded-2xl overflow-hidden glass">
              <div className="bg-slate-900/50 p-4 border-b border-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400">
                Category List
              </div>
              <ul className="divide-y divide-slate-900">
                {categoriesData?.map((cat) => (
                  <li key={cat._id} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-white">{cat.name}</span>
                      <span className="text-xs text-gray-500 block">{cat.description || "No description"}</span>
                    </div>
                  </li>
                ))}
                {!categoriesData?.length && (
                  <li className="p-8 text-center text-xs text-gray-500 italic">No categories created yet.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Brands Manager */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Brands</h3>
              {!showBrandForm && (
                <button
                  onClick={() => setShowBrandForm(true)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  + Create Brand
                </button>
              )}
            </div>

            {showBrandForm && (
              <form onSubmit={handleBrandSubmit} className="glass-card p-5 rounded-2xl border border-slate-900 flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white">Create Brand</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none"
                    placeholder="Nest"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Description</label>
                  <textarea
                    rows={3}
                    value={brandForm.description}
                    onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-xs text-white focus:outline-none resize-none"
                    placeholder="Maker of intelligent thermostats..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBrandLogo(e.target.files[0])}
                    className="text-xs text-gray-400"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowBrandForm(false)}
                    className="text-xs text-gray-400 hover:text-white px-2"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="sm" loading={submitLoading}>
                    Save Brand
                  </Button>
                </div>
              </form>
            )}

            <div className="border border-slate-900 rounded-2xl overflow-hidden glass">
              <div className="bg-slate-900/50 p-4 border-b border-slate-900 text-xs font-bold uppercase tracking-wider text-slate-400">
                Brands List
              </div>
              <ul className="divide-y divide-slate-900">
                {brandsData?.map((b) => (
                  <li key={b._id} className="p-4 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-white">{b.name}</span>
                      <span className="text-xs text-gray-500 block">{b.description || "No description"}</span>
                    </div>
                  </li>
                ))}
                {!brandsData?.length && (
                  <li className="p-8 text-center text-xs text-gray-500 italic">No brands created yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
