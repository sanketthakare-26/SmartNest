import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productsApi, categoriesApi, brandsApi } from "../lib/api";
import {
  products as staticProducts,
  categories as staticCategories,
  brands as staticBrands,
} from "../lib/data";

// Category fallback local assets
import cctv from "../assets/cat-cctv.jpg";
import lock from "../assets/cat-lock.jpg";
import gate from "../assets/cat-gate.jpg";
import curtain from "../assets/cat-curtain.jpg";
import lift from "../assets/cat-lift.jpg";
import touch from "../assets/cat-touch.jpg";
import sensor from "../assets/cat-sensor.jpg";
import kit from "../assets/cat-kit.jpg";

const localAssetMap = {
  "cat-cctv.jpg": cctv,
  "cat-lock.jpg": lock,
  "cat-gate.jpg": gate,
  "cat-curtain.jpg": curtain,
  "cat-lift.jpg": lift,
  "cat-touch.jpg": touch,
  "cat-sensor.jpg": sensor,
  "cat-kit.jpg": kit,
};

const resolveCategoryImage = (imageUrl) => {
  if (!imageUrl) return "";

  // If it's a full URL, return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  // Check if it matches any of our static assets
  for (const [key, asset] of Object.entries(localAssetMap)) {
    if (imageUrl.includes(key)) {
      return asset;
    }
  }

  // If it's a relative path on the server (like /uploads/...)
  const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return `${baseUrl}/${imageUrl.replace(/^\//, "")}`;
};

const StoreContext = createContext(null);

const normalizeProduct = (p) => {
  if (!p) return null;
  
  // Extract category info
  let categorySlug = "";
  let categoryName = "";
  if (p.category && typeof p.category === "object") {
    categorySlug = p.category.slug;
    categoryName = p.category.name;
  } else {
    categorySlug = p.categorySlug || p.category || "";
  }

  // Extract brand info
  let brandSlug = "";
  let brandName = "";
  if (p.brand && typeof p.brand === "object") {
    brandSlug = p.brand.slug;
    brandName = p.brand.name;
  } else {
    brandSlug = p.brand || "";
  }

  // Specifications formatting
  const specs = (p.specifications || p.specs || []).map((s) => ({
    label: s.key || s.label || "",
    value: s.value || "",
  }));

  // Image formatting
  const images = p.images || [];
  const image = p.image || (images.length > 0 ? images[0] : "");

  return {
    id: p._id || p.id || p.slug,
    _id: p._id || p.id,
    name: p.name || "",
    slug: p.slug || "",
    brand: brandSlug,
    brandName: brandName,
    categorySlug: categorySlug,
    categoryName: categoryName,
    image,
    images,
    tag: p.tag || (p.featured ? "Featured" : ""),
    shortDescription: p.shortDescription || p.description || "",
    description: p.description || p.shortDescription || "",
    price: p.price || 0,
    specs,
    inStock: p.inStock !== false,
    featured: !!p.featured,
  };
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch in parallel
      const [prodRes, catRes, brandRes] = await Promise.allSettled([
        productsApi.getAll({ limit: 1000 }),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);

      let loadedProducts = [];
      let loadedCategories = [];
      let loadedBrands = [];

      // 1. Process Products
      if (prodRes.status === "fulfilled") {
        const rawProducts = prodRes.value.products || [];
        loadedProducts = rawProducts.map(normalizeProduct);
      } else {
        console.warn("⚠️ Failed to load products from API, falling back to static data.");
        loadedProducts = staticProducts.map(normalizeProduct);
      }

      // 2. Process Categories
      if (catRes.status === "fulfilled") {
        const rawCats = catRes.value.categories || catRes.value || [];
        loadedCategories = rawCats.map((c) => ({
          ...c,
          tagline: c.tagline || c.description || "",
          image: resolveCategoryImage(c.image),
        }));
      } else {
        console.warn("⚠️ Failed to load categories from API, falling back to static data.");
        loadedCategories = staticCategories;
      }

      // 3. Process Brands
      if (brandRes.status === "fulfilled") {
        loadedBrands = brandRes.value.brands || brandRes.value || [];
      } else {
        console.warn("⚠️ Failed to load brands from API, falling back to static data.");
        loadedBrands = staticBrands;
      }

      setProducts(loadedProducts);
      setCategories(loadedCategories);
      setBrands(loadedBrands);
      setError(null);
    } catch (err) {
      console.error("❌ Error initializing store data:", err);
      // Absolute fallback
      setProducts(staticProducts.map(normalizeProduct));
      setCategories(staticCategories);
      setBrands(staticBrands);
      setError(err.message || "Failed to load database. Using static data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getProduct = useCallback((slug) => {
    return products.find((p) => p.slug === slug || p.id === slug || p._id === slug);
  }, [products]);

  const getCategory = useCallback((slug) => {
    return categories.find((c) => c.slug === slug || c._id === slug);
  }, [categories]);

  const getBrand = useCallback((slug) => {
    return brands.find((b) => b.slug === slug || b._id === slug);
  }, [brands]);

  const productsByCategory = useCallback((slug) => {
    return products.filter((p) => p.categorySlug === slug);
  }, [products]);

  const productsByBrand = useCallback((slug) => {
    return products.filter((p) => p.brand === slug);
  }, [products]);

  // Derive home sections dynamically from current state
  const featuredProducts = products.filter((p) => p.tag === "Featured" || p.tag === "Top Seller").slice(0, 8);
  const topSelling = products.filter((p) => p.tag === "Top Seller");
  const trending = products.filter((p) => p.tag === "Trending");

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        loading,
        error,
        refresh: loadData,
        getProduct,
        getCategory,
        getBrand,
        productsByCategory,
        productsByBrand,
        featuredProducts,
        topSelling,
        trending,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
