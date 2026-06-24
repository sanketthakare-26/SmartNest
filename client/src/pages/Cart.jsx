import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { whatsappLink } from "../lib/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Cart() {
  const { cart, updateCartQty, removeFromCart, clearCart, cartCount } = useCart();
  const { products } = useStore();

  // Hydrate cart items with full product details from the store
  const cartItemsWithInfo = cart
    .map((item) => {
      const fullProd = products.find((p) => p.id === item.id || p._id === item.id);
      if (!fullProd) return null;
      return {
        ...item,
        price: fullProd.price || 0,
        brandName: fullProd.brandName || fullProd.brand || "",
        categoryName: fullProd.categoryName || "",
      };
    })
    .filter(Boolean);

  // Calculate pricing
  const pricedItems = cartItemsWithInfo.filter((item) => item.price > 0);
  const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasEnquiryOnlyItems = cartItemsWithInfo.some((item) => item.price === 0);

  // Build WhatsApp message
  const getWhatsAppMessage = () => {
    let msg = "Hi SmartNest! I'm interested in the following products:\n\n";
    cartItemsWithInfo.forEach((item) => {
      const priceStr = item.price > 0 ? `(₹${item.price.toLocaleString("en-IN")} onwards)` : "(Price on enquiry)";
      msg += `• ${item.name} - Qty: ${item.qty} ${priceStr}\n`;
    });

    if (subtotal > 0) {
      msg += `\nEstimated Subtotal: ₹${subtotal.toLocaleString("en-IN")} onwards`;
    }
    
    msg += "\n\nPlease share details regarding availability and certified installation services.";
    return whatsappLink(msg);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your Order</span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My Cart</h1>
        <p className="max-w-xl text-muted-foreground">
          Manage your selected products and send a direct enquiry to finalize your quote and installation schedule.
        </p>
      </div>

      {cartItemsWithInfo.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-card max-w-lg mx-auto">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary/80 text-muted-foreground mx-auto">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-lg font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Looks like you haven't added anything to your cart yet. Let's find some smart solutions!
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-soft transition hover:opacity-90 active:scale-95"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm font-semibold text-muted-foreground">{cartCount} Item{cartCount !== 1 && "s"}</span>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-destructive hover:underline"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cartItemsWithInfo.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-card transition duration-300"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover border border-border bg-muted shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-bold text-foreground hover:text-primary transition line-clamp-1 text-sm sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.brandName}</p>
                      
                      <div className="mt-1 text-xs sm:hidden">
                        {item.price > 0 ? (
                          <span className="font-bold text-primary">₹{item.price.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-muted-foreground">Price on enquiry</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-border/40 pt-3 sm:border-t-0 sm:pt-0">
                    {/* Price - Desktop only */}
                    <div className="hidden sm:block text-right w-24">
                      {item.price > 0 ? (
                        <div>
                          <p className="font-bold text-foreground">₹{item.price.toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">onwards</p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground font-medium">Enquiry Only</p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-xl border border-border bg-secondary/30 p-1">
                      <button
                        onClick={() => updateCartQty(item.id, item.qty - 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-card text-foreground transition active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-foreground">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.id, item.qty + 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-card text-foreground transition active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Total price for this item */}
                    <div className="text-right w-24 hidden sm:block">
                      {item.price > 0 ? (
                        <span className="font-extrabold text-primary">
                          ₹{(item.price * item.qty).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-semibold">—</span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card sticky top-24">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
              
              <div className="mt-6 space-y-3.5 border-b border-border pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-semibold text-foreground">{cartCount}</span>
                </div>
                
                {subtotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Priced Subtotal</span>
                    <span className="font-semibold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {hasEnquiryOnlyItems && (
                  <div className="rounded-xl bg-secondary/50 p-3 text-[11px] text-muted-foreground leading-normal">
                    💡 Your cart contains items marked as **Enquiry Only**. We will provide custom quotes for these items in our WhatsApp discussion.
                  </div>
                )}
              </div>

              {subtotal > 0 ? (
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-foreground">Estimated Total</span>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-primary">₹{subtotal.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">onwards (incl. installation)</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-muted-foreground py-2">
                  No priced items. All products are structured as custom configurations.
                </div>
              )}

              {/* WhatsApp checkout link */}
              <a
                href={getWhatsAppMessage()}
                target="_blank"
                rel="noreferrer"
                className="mt-6 relative overflow-hidden flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition hover:bg-primary/95 group"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-white opacity-10"
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                />
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                Send Enquiry on WhatsApp
              </a>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
