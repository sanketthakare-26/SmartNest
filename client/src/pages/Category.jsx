import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import { ArrowLeft, AlertCircle } from "lucide-react";

const Category = () => {
  const { slug } = useParams();
  const { data: category, loading: catLoading } = useFetch(`/categories/${slug}`);

  const categoryId = category?._id;
  const { data: productsData, loading: prodLoading } = useFetch(
    categoryId ? `/products?category=${categoryId}` : null
  );

  const loading = catLoading || prodLoading;

  if (loading) {
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <Loader variant="spinner" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto text-center">
        <p className="text-gray-400">Category not found.</p>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const products = productsData?.products || [];

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto text-left min-h-screen">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition">
        <ArrowLeft size={16} />
        <span>Back to catalog</span>
      </Link>

      <div className="mb-12 border-b border-slate-900 pb-8">
        <h1 className="text-4xl font-extrabold text-white mb-3">{category.name}</h1>
        <p className="text-gray-400 text-sm max-w-2xl">{category.description || "Browse our selected smart devices in this category."}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl p-6">
          <p className="text-gray-400">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
