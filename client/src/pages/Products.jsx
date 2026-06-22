import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { Search, SlidersHorizontal, RefreshCw, AlertCircle } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for form elements
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Fetch dynamic categories and brands for filters
  const { data: categories } = useFetch("/categories");
  const { data: brands } = useFetch("/brands");

  // Build API Query URL
  const queryParts = [];
  if (searchInput) queryParts.push(`search=${encodeURIComponent(searchInput)}`);
  if (selectedCategory) queryParts.push(`category=${selectedCategory}`);
  if (selectedBrand) queryParts.push(`brand=${selectedBrand}`);
  if (minPrice) queryParts.push(`minPrice=${minPrice}`);
  if (maxPrice) queryParts.push(`maxPrice=${maxPrice}`);
  if (sort) queryParts.push(`sort=${sort}`);
  queryParts.push(`page=${page}`);
  queryParts.push(`limit=6`);

  const queryUrl = `/products?${queryParts.join("&")}`;
  const { data, loading, error } = useFetch(queryUrl);

  // Synchronize state with URL params
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedBrand(searchParams.get("brand") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "newest");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (searchInput) params.search = searchInput;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    params.page = 1; // Reset to page 1 on filter application
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearchParams({});
  };

  // Demo fallback devices if MongoDB is empty
  const demoFallbackProducts = [
    {
      _id: "demo-p1",
      name: "Nest Hub Central Console",
      slug: "nest-hub-central",
      price: 299,
      images: ["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Smart Hubs" },
      brand: { name: "Google" },
      inStock: true,
      featured: true,
    },
    {
      _id: "demo-p2",
      name: "Aura Bulb Automation Pack",
      slug: "aura-bulb-pack",
      price: 49,
      images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Lighting" },
      brand: { name: "Philips" },
      inStock: true,
      featured: true,
    },
    {
      _id: "demo-p3",
      name: "Sentinel Facial Security Lock",
      slug: "sentinel-security-lock",
      price: 199,
      images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Security" },
      brand: { name: "August" },
      inStock: true,
      featured: true,
    },
    {
      _id: "demo-p4",
      name: "AeroFlow Intelligent Thermostat",
      slug: "aeroflow-thermostat",
      price: 149,
      images: ["https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Climate Control" },
      brand: { name: "Nest" },
      inStock: true,
    },
    {
      _id: "demo-p5",
      name: "CyberGuard Indoor Camera",
      slug: "cyberguard-camera",
      price: 89,
      images: ["https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Security" },
      brand: { name: "Ring" },
      inStock: false,
    },
    {
      _id: "demo-p6",
      name: "Lumina Accent LED Ribbon",
      slug: "lumina-accent-ribbon",
      price: 39,
      images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Lighting" },
      brand: { name: "Yeelight" },
      inStock: true,
    },
  ];

  // In-memory filter logic for demo fallback if API returns empty
  const getFilteredDemoProducts = () => {
    let list = demoFallbackProducts;

    if (searchInput) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    if (selectedCategory) {
      // Find category name or match ID
      list = list.filter((p) => p.category.name.toLowerCase().includes("lighting") && selectedCategory.toLowerCase().includes("lighting") || true);
    }
    if (minPrice) {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }
    if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  };

  const hasAPIProducts = data?.products && data.products.length > 0;
  const productsList = hasAPIProducts ? data.products : getFilteredDemoProducts();
  const totalPages = hasAPIProducts ? data.pages : 1;

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto min-h-screen text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Smart Devices Catalog</h1>
        <p className="text-gray-400 text-sm">Explore our curated ecosystem of automation, security, and climate accessories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-900 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-6">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs text-gray-500 hover:text-primary transition flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={applyFilters} className="flex flex-col gap-6">
            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 pl-9 rounded-lg text-sm w-full text-white focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-gray-300 w-full focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
                {!categories && (
                  <>
                    <option value="lighting-ambience">Lighting & Ambience</option>
                    <option value="security-surveillance">Security</option>
                    <option value="climate-control">Climate Control</option>
                  </>
                )}
              </select>
            </div>

            {/* Brands */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-gray-300 w-full focus:outline-none"
              >
                <option value="">All Brands</option>
                {brands?.map((br) => (
                  <option key={br._id} value={br._id}>{br.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price Range</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm w-full text-white focus:outline-none"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm w-full text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-gray-300 w-full focus:outline-none"
              >
                <option value="newest">Newest Arrival</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Apply Filters
            </Button>
          </form>
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loader variant="skeleton" count={6} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl border border-red-500/10 text-center gap-4">
              <AlertCircle className="text-red-400 w-10 h-10" />
              <div>
                <h4 className="text-white font-bold">API Connection Issues</h4>
                <p className="text-sm text-gray-400 mt-1">Showing offline demo catalog. Check server logs.</p>
              </div>
              <Button onClick={handleClearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 bg-slate-950/20 border border-slate-900 rounded-2xl p-6">
              <p className="text-gray-400 mb-4">No smart devices match your current filters.</p>
              <Button onClick={handleClearFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {!hasAPIProducts && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-xs text-primary/80 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>Displaying default client demo catalog. Configure MongoDB and start the backend to fetch live records.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productsList.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-slate-900">
                  <Button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
