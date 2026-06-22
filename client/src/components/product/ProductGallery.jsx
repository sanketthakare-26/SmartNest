import React, { useState } from "react";

const ProductGallery = ({ images = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const fallbackImage = "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80";

  const getFullUrl = (url) => {
    if (!url) return fallbackImage;
    return url.startsWith("http") ? url : `http://localhost:5000${url}`;
  };

  const activeImage = images.length > 0 ? getFullUrl(images[activeIdx]) : fallbackImage;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full h-80 md:h-[450px] rounded-2xl overflow-hidden glass bg-slate-950/20 border border-slate-900 flex items-center justify-center p-2">
        <img
          src={activeImage}
          alt="Product Gallery Main"
          className="w-full h-full object-contain rounded-xl transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIdx === idx ? "border-primary scale-[1.03]" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <img
                src={getFullUrl(img)}
                alt={`Product Gallery Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
