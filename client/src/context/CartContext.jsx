import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("sn_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("sn_wishlist") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem("sn_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem("sn_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === (product.id || product._id));
      if (exists) {
        toast.info(`${product.name} quantity updated in cart`);
        return prev.map((p) =>
          p.id === (product.id || product._id) ? { ...p, qty: p.qty + 1 } : p
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { id: product.id || product._id, name: product.name, image: product.image, slug: product.slug, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
    toast.success("Removed from cart");
  }, []);

  const clearCart = useCallback(() => { setCart([]); }, []);

  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const id = product.id || product._id;
      const exists = prev.find((p) => p.id === id);
      if (exists) {
        toast.info(`${product.name} removed from wishlist`);
        return prev.filter((p) => p.id !== id);
      }
      toast.success(`${product.name} added to wishlist`);
      return [...prev, { id, name: product.name, image: product.image, slug: product.slug }];
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.some((p) => p.id === id),
    [wishlist]
  );

  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, cartCount,
      wishlist, toggleWishlist, isWishlisted, wishlistCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
