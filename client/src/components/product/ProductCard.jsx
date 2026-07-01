import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, ShoppingCart } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { cn } from "@/lib/utils";

const tagStyles = {
  "Top Seller": "bg-amber-soft text-foreground",
  "Trending":   "bg-mint-soft text-foreground",
  "Featured":   "bg-secondary text-foreground",
  "New":        "bg-primary text-primary-foreground",
};

export function ProductCard({ product, index = 0 }) {
  const { brands } = useStore();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const brand = brands.find((b) => b.slug === product.brand);
  const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
  const wishlisted = isWishlisted(product.id || product._id);

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
    >
      {/* Image area — clickable to product detail */}
      <Link to={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-secondary block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className={`h-full w-full object-cover transition duration-700 ${secondImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
        />
        {secondImage && (
          <img
            src={secondImage}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        {product.tag && (
          <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-semibold ${tagStyles[product.tag] || "bg-secondary"}`}>
            {product.tag}
          </span>
        )}
        {/* Wishlist heart — top right */}
        <button
          aria-label="Toggle Wishlist"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className={cn(
            "absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-soft backdrop-blur transition duration-300",
            wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart className={cn("h-4 w-4 transition", wishlisted ? "fill-rose-500 text-rose-500" : "text-foreground")} />
        </button>
        {/* View arrow — appears on hover */}
        <span className="absolute right-3 bottom-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-foreground text-background opacity-0 shadow-soft transition duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {brand?.name || product.brand}
        </div>
        <div className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
          {product.name}
        </div>
        {product.price > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-base font-bold text-primary">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">onwards</span>
          </div>
        )}
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <button
            aria-label="Add to Cart"
            onClick={() => addToCart(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:opacity-90 active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </button>
          <button
            aria-label="Wishlist"
            onClick={() => toggleWishlist(product)}
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border transition active:scale-95",
              wishlisted ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-card hover:bg-secondary text-foreground/70"
            )}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-rose-500 text-rose-500")} />
          </button>
        </div>
      </div>
    </div>
  );
}
