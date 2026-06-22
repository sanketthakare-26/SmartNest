import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import ProductCard from "../product/ProductCard";
import Loader from "../common/Loader";
import { ArrowRight } from "lucide-react";

const ProductRow = () => {
  const { data, loading } = useFetch("/products?featured=true");

  // Fallback demo featured products
  const defaultProducts = [
    {
      _id: "demo-p1",
      name: "Nest Hub Central Console",
      slug: "nest-hub-central",
      price: 299,
      images: ["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Smart Hubs" },
      brand: { name: "Google" },
      inStock: true,
    },
    {
      _id: "demo-p2",
      name: "Aura Bulb Automation Pack",
      slug: "aura-bulb-pack",
      price: 49,
      images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Lighting & Ambience" },
      brand: { name: "Philips" },
      inStock: true,
    },
    {
      _id: "demo-p3",
      name: "Sentinel Facial Security Lock",
      slug: "sentinel-security-lock",
      price: 199,
      images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80"],
      category: { name: "Security & Surveillance" },
      brand: { name: "August" },
      inStock: true,
    },
  ];

  const products = data?.products && data.products.length > 0 ? data.products : defaultProducts;

  if (loading && data === null) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <Loader variant="skeleton" count={3} />
      </div>
    );
  }

  return (
    <section className="py-20 px-6 md:px-12 bg-[#0A0E17]">
      <div className="max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              Featured Devices
            </h2>
            <p className="text-gray-400 max-w-lg">
              Explore our highest-rated smart home essentials, trusted by automated households worldwide.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-primary hover:text-primary-light transition font-semibold mt-4 md:mt-0 text-sm"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRow;
