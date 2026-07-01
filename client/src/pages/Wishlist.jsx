import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/product/ProductCard";

export function Wishlist() {
  const { wishlist } = useCart();
  const { products } = useStore();

  // Find the full product object for each item in the wishlist
  const wishlistedProducts = wishlist
    .map((item) => products.find((p) => p.id === item.id || p._id === item.id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your Collection</span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My Wishlist</h1>
        <p className="max-w-xl text-muted-foreground">
          View products you have saved for later. You can easily add them to your cart or remove them here.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-card max-w-lg mx-auto">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary/80 text-muted-foreground mx-auto">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-lg font-bold text-foreground">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our smart home products catalog and save your favorites to this list!
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-soft transition hover:opacity-90 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {wishlistedProducts.map((p, i) => (
            <ProductCard key={p.id || p._id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
