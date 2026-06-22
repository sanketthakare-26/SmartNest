import React from "react";
import { Link } from "react-router-dom";
import { Send, Eye, ShieldCheck } from "lucide-react";

const ProductCard = ({ product }) => {
  const { name, slug, price, images, category, brand, inStock } = product;

  const imageUrl = images && images.length > 0
    ? (images[0].startsWith("http") ? images[0] : `http://localhost:5000${images[0]}`)
    : "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&q=80";

  const whatsappMessage = `Hi! I would like to enquire about the "${name}" (Price: $${price}) listed on SmartNest.`;
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="group relative glass-card rounded-2xl border border-slate-800 hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col h-full hover:shadow-glass-hover">
      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950/40 border-b border-slate-900 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge: Availability */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full border ${
          inStock
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {inStock ? "Available" : "Out of Stock"}
        </span>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
          <Link
            to={`/product/${slug}`}
            className="p-3 bg-primary hover:bg-primary-hover text-dark rounded-full transition-transform hover:scale-110 shadow-lg"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-secondary hover:bg-secondary-hover text-white rounded-full transition-transform hover:scale-110 shadow-lg"
            title="Enquire on WhatsApp"
          >
            <Send size={20} />
          </a>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Brand & Category info */}
        <div className="flex items-center gap-2 mb-2">
          {brand?.name && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              {brand.name}
            </span>
          )}
          <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/5">
            {category?.name || "General"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          <Link to={`/product/${slug}`}>{name}</Link>
        </h3>

        {/* Price & Rating */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-900">
          <div>
            <span className="text-xs text-gray-500 block">Pricing</span>
            <span className="text-lg font-extrabold text-white">${price}</span>
          </div>
          <Link
            to={`/product/${slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-gray-400 group-hover:text-primary group-hover:border-primary/20 transition-all font-semibold"
          >
            <span>Learn More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
