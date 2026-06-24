import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";
import {
  productsApi,
  categoriesApi,
  brandsApi,
  enquiriesApi,
} from "../../lib/api";
import {
  products as staticProducts,
  categories as staticCategories,
  brands as staticBrands,
} from "../../lib/data";
import {
  Package,
  FolderOpen,
  Tag,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Upload,
  Check,
  X,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const { token, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Navigation Guard
  useEffect(() => {
    document.title = "Admin Dashboard — SmartNest";
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [activeTab, setActiveTab] = useState("products");

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States (for creating/updating)
  const [isEditing, setIsEditing] = useState(null); // ID of element being edited, or "new"
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    categorySlug: "",
    brand: "",
    tag: "",
    image: "",
    imagesInput: "",
    specsInput: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    tagline: "",
  });

  const [brandForm, setBrandForm] = useState({
    name: "",
    slug: "",
  });

  // Load Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      if (token) {
        try {
          const prodData = await productsApi.getAll();
          setProducts(prodData.products);
        } catch {
          setProducts(staticProducts);
        }

        try {
          const catData = await categoriesApi.getAll();
          setCategories(catData.categories);
        } catch {
          setCategories(staticCategories);
        }

        try {
          const brandData = await brandsApi.getAll();
          setBrands(brandData.brands);
        } catch {
          setBrands(staticBrands);
        }

        try {
          const enqData = await enquiriesApi.getAll(token);
          setEnquiries(enqData.enquiries);
        } catch {
          // Initialize mock enquiries in localStorage if they don't exist
          const mock = localStorage.getItem("smartnest_mock_enquiries");
          if (mock) {
            setEnquiries(JSON.parse(mock));
          } else {
            const initialMock = [
              {
                _id: "mock-1",
                name: "Rohan Sharma",
                phone: "+91 98765 43210",
                email: "rohan@gmail.com",
                message: "Need a site visit for CCTV installation in my villa.",
                category: "CCTV & Surveillance",
                status: "Pending",
                createdAt: new Date().toISOString(),
              },
              {
                _id: "mock-2",
                name: "Anjali Gupta",
                phone: "+91 99999 88888",
                email: "anjali@yahoo.com",
                message: "Interested in the Samsung SHP-DP609 smart door lock.",
                category: "Digital Door Locks",
                status: "Contacted",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
              },
            ];
            localStorage.setItem("smartnest_mock_enquiries", JSON.stringify(initialMock));
            setEnquiries(initialMock);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync some data from backend. Using static/local data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadAllData();
    }
  }, [isAuthenticated, token]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm font-semibold text-muted-foreground">Loading Admin Session...</p>
      </div>
    );
  }

  // Handle Log out
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  // Product CRUD
  const saveProduct = async (e) => {
    e.preventDefault();
    if (!token) return;

    // Parse specs: "label: value, label: value"
    const parsedSpecs = productForm.specsInput
      .split("\n")
      .map((line) => {
        const parts = line.split(":");
        if (parts.length >= 2) {
          return { label: parts[0].trim(), value: parts.slice(1).join(":").trim() };
        }
        return null;
      })
      .filter(Boolean);

    const imgList = productForm.imagesInput
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean);

    const categoryObj = categories.find((c) => c.slug === productForm.categorySlug);
    const brandObj = brands.find((b) => b.slug === productForm.brand);

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("shortDescription", productForm.shortDescription);
    formData.append("price", 199); // default required price

    if (categoryObj) {
      formData.append("category", categoryObj._id);
    } else {
      formData.append("category", productForm.categorySlug);
    }

    if (brandObj) {
      formData.append("brand", brandObj._id);
    } else {
      formData.append("brand", productForm.brand);
    }

    formData.append("featured", productForm.tag === "Featured" ? "true" : "false");
    formData.append("inStock", "true");

    const specifications = parsedSpecs.map((s) => ({
      key: s.label,
      value: s.value,
    }));
    formData.append("specifications", JSON.stringify(specifications));

    formData.append("image", productForm.image || (imgList.length > 0 ? imgList[0] : ""));
    imgList.forEach((img) => {
      formData.append("images", img);
      if (isEditing !== "new") {
        formData.append("existingImages", img);
      }
    });

    try {
      if (isEditing === "new") {
        await productsApi.create(formData, token);
        toast.success("Product created successfully");
      } else {
        await productsApi.update(isEditing, formData, token);
        toast.success("Product updated successfully");
      }
      setIsEditing(null);
      await loadAllData();
    } catch (err) {
      toast.error(err?.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productsApi.delete(id, token);
        toast.success("Product deleted");
        await loadAllData();
      } catch (err) {
        toast.error(err?.message || "Failed to delete product");
      }
    }
  };

  const startEditProduct = (prod) => {
    setIsEditing(prod.id || prod._id);
    const specsArray = prod.specifications || prod.specs || [];
    const specsStr = specsArray.map((s) => `${s.key || s.label}: ${s.value}`).join("\n");
    const imgsStr = prod.images ? prod.images.join(", ") : "";

    const categorySlug = prod.categorySlug || (prod.category && typeof prod.category === "object" ? prod.category.slug : prod.category) || "";
    const brandSlug = prod.brandSlug || (prod.brand && typeof prod.brand === "object" ? prod.brand.slug : prod.brand) || "";

    setProductForm({
      name: prod.name,
      description: prod.description || prod.shortDescription || "",
      shortDescription: prod.shortDescription || "",
      categorySlug: categorySlug,
      brand: brandSlug,
      tag: prod.tag || (prod.featured ? "Featured" : ""),
      image: prod.image || "",
      imagesInput: imgsStr,
      specsInput: specsStr,
    });
  };

  const startNewProduct = () => {
    setIsEditing("new");
    setProductForm({
      name: "",
      description: "",
      shortDescription: "",
      categorySlug: categories[0]?.slug || "cctv-surveillance",
      brand: brands[0]?.slug || "hikvision",
      tag: "",
      image: "",
      imagesInput: "",
      specsInput: "Warranty: 2 Years Manufacturer\nInstallation: Included",
    });
  };

  // Enquiry Update Status & Delete
  const updateEnquiryStatus = async (id, newStatus) => {
    try {
      await enquiriesApi.updateStatus(id, newStatus, token);
      toast.success(`Enquiry status updated to ${newStatus}`);
      await loadAllData();
    } catch (err) {
      toast.error(err?.message || "Failed to update enquiry status");
    }
  };

  const deleteEnquiry = async (id) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await enquiriesApi.delete(id, token);
        toast.success("Enquiry deleted");
        await loadAllData();
      } catch (err) {
        toast.error(err?.message || "Failed to delete enquiry");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !token) return;

    const formData = new FormData();
    formData.append("name", categoryForm.name);
    formData.append("description", categoryForm.tagline || "");

    try {
      await categoriesApi.create(formData, token);
      toast.success("Category added successfully");
      setCategoryForm({ name: "", slug: "", tagline: "" });
      await loadAllData();
    } catch (err) {
      toast.error(err?.message || "Failed to add category");
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.name || !token) return;

    const formData = new FormData();
    formData.append("name", brandForm.name);

    try {
      await brandsApi.create(formData, token);
      toast.success("Brand added successfully");
      setBrandForm({ name: "", slug: "" });
      await loadAllData();
    } catch (err) {
      toast.error(err?.message || "Failed to add brand");
    }
  };

  return (
    <div className="min-h-screen bg-secondary/15 flex flex-col md:flex-row">
      {/* Side Menu */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base tracking-tight">SmartNest Admin</h2>
            <p className="text-xs text-muted-foreground">Management Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <TabButton
            active={activeTab === "products"}
            onClick={() => { setActiveTab("products"); setIsEditing(null); }}
            icon={Package}
            label="Products"
          />
          <TabButton
            active={activeTab === "categories"}
            onClick={() => { setActiveTab("categories"); setIsEditing(null); }}
            icon={FolderOpen}
            label="Categories"
          />
          <TabButton
            active={activeTab === "brands"}
            onClick={() => { setActiveTab("brands"); setIsEditing(null); }}
            icon={Tag}
            label="Brands"
          />
          <TabButton
            active={activeTab === "enquiries"}
            onClick={() => { setActiveTab("enquiries"); setIsEditing(null); }}
            icon={MessageSquare}
            label="Enquiries"
            badgeCount={enquiries.filter((e) => e.status === "Pending").length}
          />
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {loading ? (
          <div className="h-full flex items-center justify-center py-20">
            <p className="text-sm text-muted-foreground font-semibold">Loading data...</p>
          </div>
        ) : (
          <div>
            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Products Catalog</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">Manage products showcased on your website.</p>
                      </div>
                      <button
                        onClick={startNewProduct}
                        className="inline-flex items-center gap-2 bg-foreground text-background font-semibold rounded-full px-5 py-2.5 text-sm transition hover:opacity-90 active:scale-95 shadow-soft"
                      >
                        <Plus className="h-4 w-4" /> Add Product
                      </button>
                    </div>

                    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-card">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                            <th className="px-6 py-3.5">Image</th>
                            <th className="px-6 py-3.5">Name</th>
                            <th className="px-6 py-3.5">Brand</th>
                            <th className="px-6 py-3.5">Category</th>
                            <th className="px-6 py-3.5">Tag</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id || p._id} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                              <td className="px-6 py-3">
                                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-border bg-muted" />
                              </td>
                              <td className="px-6 py-3 font-semibold text-foreground max-w-[200px] truncate">{p.name}</td>
                              <td className="px-6 py-3 text-muted-foreground capitalize">
                                {typeof p.brand === "object" ? p.brand?.name : (brands.find((b) => b.slug === p.brand || b._id === p.brand)?.name || p.brand)}
                              </td>
                              <td className="px-6 py-3 text-muted-foreground">
                                {p.category?.name || categories.find((c) => c.slug === p.categorySlug || c._id === p.category)?.name || p.categorySlug}
                              </td>
                              <td className="px-6 py-3">
                                {p.tag && <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold">{p.tag}</span>}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button onClick={() => startEditProduct(p)} className="p-2 text-foreground/80 hover:text-foreground hover:bg-secondary rounded-xl transition" title="Edit">
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => deleteProduct(p.id || p._id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition" title="Delete">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Product Edit Form
                  <div className="space-y-6 max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h2 className="text-xl font-bold">{isEditing === "new" ? "Add New Product" : "Edit Product"}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Fill in details for this product.</p>
                      </div>
                      <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-secondary rounded-xl transition">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={saveProduct} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name</label>
                          <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Tag</label>
                          <select value={productForm.tag} onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary">
                            <option value="">None</option>
                            <option value="Top Seller">Top Seller</option>
                            <option value="Trending">Trending</option>
                            <option value="Featured">Featured</option>
                            <option value="New">New</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                          <select value={productForm.categorySlug} onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary">
                            {categories.map((c) => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</label>
                          <select value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary">
                            {brands.map((b) => (
                              <option key={b.slug} value={b.slug}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Image URL</label>
                        <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="Paste main image link" className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gallery Image URLs (Comma Separated)</label>
                        <input value={productForm.imagesInput} onChange={(e) => setProductForm({ ...productForm, imagesInput: e.target.value })} placeholder="URL 1, URL 2, URL 3" className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Description</label>
                        <input required value={productForm.shortDescription} onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-primary" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detailed Description</label>
                        <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specifications (One per line as: Label: Value)</label>
                        <textarea rows={4} value={productForm.specsInput} onChange={(e) => setProductForm({ ...productForm, specsInput: e.target.value })} placeholder="Warranty: 2 Years&#10;Resolution: 4MP&#10;Night Vision: 30m" className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary font-mono text-xs" />
                      </div>

                      <div className="flex justify-end gap-3 border-t border-border pt-4">
                        <button type="button" onClick={() => setIsEditing(null)} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition active:scale-95">Cancel</button>
                        <button type="submit" className="rounded-xl bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:opacity-95 transition active:scale-95">Save Product</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage smart home product categories.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
                  <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-card">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                          <th className="px-6 py-3.5">Name</th>
                          <th className="px-6 py-3.5">Slug</th>
                          <th className="px-6 py-3.5">Tagline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.slug} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                            <td className="px-6 py-3 font-semibold text-foreground">{c.name}</td>
                            <td className="px-6 py-3 text-muted-foreground">{c.slug}</td>
                            <td className="px-6 py-3 text-muted-foreground max-w-[200px] truncate">{c.tagline || c.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
                    <h3 className="font-bold text-base mb-4">Add Category</h3>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category Name</label>
                        <input required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</label>
                        <input required value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline</label>
                        <input value={categoryForm.tagline} onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <button type="submit" className="w-full h-10 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 active:scale-95 transition">Add Category</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Brands Tab */}
            {activeTab === "brands" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Brands</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage partner smart home automation brands.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
                  <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-card">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                          <th className="px-6 py-3.5">Name</th>
                          <th className="px-6 py-3.5">Slug</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brands.map((b) => (
                          <tr key={b.slug} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                            <td className="px-6 py-3 font-semibold text-foreground">{b.name}</td>
                            <td className="px-6 py-3 text-muted-foreground">{b.slug}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
                    <h3 className="font-bold text-base mb-4">Add Brand</h3>
                    <form onSubmit={handleAddBrand} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand Name</label>
                        <input required value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug</label>
                        <input required value={brandForm.slug} onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <button type="submit" className="w-full h-10 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 active:scale-95 transition">Add Brand</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Enquiries Tab */}
            {activeTab === "enquiries" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Customer Enquiries</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Review lead forms and WhatsApp callback requests.</p>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-card">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                        <th className="px-6 py-3.5">Customer</th>
                        <th className="px-6 py-3.5">Contact info</th>
                        <th className="px-6 py-3.5">Category Interest</th>
                        <th className="px-6 py-3.5">Enquiry Date</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((e) => (
                        <tr key={e._id} className="border-b border-border last:border-0 hover:bg-secondary/10 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="font-semibold text-foreground">{e.name}</div>
                            {e.message && <p className="text-xs text-muted-foreground max-w-sm mt-1 whitespace-pre-line italic">"{e.message}"</p>}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="text-xs text-foreground font-medium">{e.phone}</div>
                            {e.email && <div className="text-xs text-muted-foreground">{e.email}</div>}
                          </td>
                          <td className="px-6 py-3.5 text-muted-foreground">{e.category || "General"}</td>
                          <td className="px-6 py-3.5 text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-3.5">
                            <select
                              value={e.status || "Pending"}
                              onChange={(evt) => updateEnquiryStatus(e._id, evt.target.value)}
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold outline-none border border-border ${
                                e.status === "Completed"
                                  ? "bg-mint-soft text-foreground"
                                  : e.status === "Contacted"
                                  ? "bg-amber-soft text-foreground"
                                  : "bg-secondary text-foreground"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button onClick={() => deleteEnquiry(e._id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition" title="Delete">
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {enquiries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">No customer enquiries received yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badgeCount,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span>{label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={`ml-auto grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[10px] font-bold ${active ? "bg-background text-foreground" : "bg-primary text-primary-foreground"}`}>
          {badgeCount}
        </span>
      )}
    </button>
  );
}

export default Dashboard;
