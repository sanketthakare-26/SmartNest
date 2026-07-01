import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ images, productName }) {
  const productImages = images && images.length > 0 ? images : ["/placeholder.jpg"];
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card aspect-square">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImgIdx}
            src={productImages[activeImgIdx]}
            alt={productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover touch-pinch-zoom"
            style={{ touchAction: "pinch-zoom" }}
          />
        </AnimatePresence>
      </div>
      
      {productImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {productImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImgIdx(i)}
              className={`relative overflow-hidden rounded-2xl border bg-card aspect-square transition duration-300 ${activeImgIdx === i ? "border-primary ring-2 ring-primary/20 scale-95" : "border-border hover:border-foreground/45"}`}
            >
              <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
