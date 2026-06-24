import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, CalendarDays, ShieldCheck, ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { whatsappLink } from "../lib/data";
import { ProductCard } from "../components/product/ProductCard";
import { ProductGallery } from "../components/product/ProductGallery";
import { SpecTable } from "../components/product/SpecTable";
import { BookingModal } from "../components/product/BookingModal";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Cart + Wishlist buttons (desktop) ─────────────────────────────────────────
function CartWishlistButtons({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id || product._id);
  return (
    <div className="mt-7 hidden gap-3 sm:flex">
      <button
        onClick={() => addToCart(product)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-soft transition hover:opacity-90 active:scale-[0.98]"
      >
        <ShoppingCart className="h-4 w-4" /> Add to Cart
      </button>
      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-semibold transition active:scale-[0.98]",
          wishlisted
            ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-border bg-card text-foreground hover:bg-secondary"
        )}
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-rose-500 text-rose-500")} />
        {wishlisted ? "Wishlisted" : "Wishlist"}
      </button>
    </div>
  );
}

// ── Mobile sticky cart + wishlist buttons ─────────────────────────────────────
function MobileCartWishlistButtons({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id || product._id);
  return (
    <>
      <button
        onClick={() => addToCart(product)}
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-foreground text-background shadow-soft transition active:scale-95"
        aria-label="Add to cart"
      >
        <ShoppingCart className="h-5 w-5" />
      </button>
      <button
        onClick={() => toggleWishlist(product)}
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-full border transition active:scale-95",
          wishlisted
            ? "border-rose-300 bg-rose-50 text-rose-500"
            : "border-border bg-card text-foreground"
        )}
        aria-label="Toggle wishlist"
      >
        <Heart className={cn("h-5 w-5", wishlisted && "fill-rose-500")} />
      </button>
    </>
  );
}


export function ProductDetail() {
  const { getProduct, getCategory, brands, products } = useStore();
  const { slug } = useParams();
  const product = getProduct(slug);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — SmartNest`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", product.shortDescription || "");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:opacity-90">
          Back to products
        </Link>
      </div>
    );
  }

  const category = getCategory(product.categorySlug);
  const brand = brands.find((b) => b.slug === product.brand);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id);

  const msg = `Hi SmartNest, I'd like to enquire about the ${product.name}.`;

  return (
    <div className="pb-28 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider">
              {category && (
                <Link to={`/category/${category.slug}`} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground hover:bg-secondary/80 transition">{category.name}</Link>
              )}
              {brand && (
                <Link to={`/brand/${brand.slug}`} className="rounded-full bg-amber-soft px-3 py-1 text-foreground hover:opacity-90 transition">{brand.name}</Link>
              )}
              {product.tag && <span className="rounded-full bg-mint-soft px-3 py-1 text-foreground">{product.tag}</span>}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
            {product.price > 0 && (
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-primary">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-muted-foreground font-medium">onwards (incl. installation)</span>
              </div>
            )}
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">{product.shortDescription}</p>

            <ul className="mt-6 space-y-2">
              {["Free site visit & consultation", "Certified-technician installation", "2-year warranty + 24/7 support"].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 text-primary" /> {b}
                </li>
              ))}
            </ul>

            {/* ── Add to Cart + Wishlist (desktop) ── */}
            <CartWishlistButtons product={product} />

            {/* ── Action buttons (desktop) ── */}
            <div className="mt-4 hidden flex-wrap gap-3 sm:flex">
              <a
                href={whatsappLink(msg)}
                target="_blank"
                rel="noreferrer"
                className="relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/95 group"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-white opacity-10"
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                />
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" /> Send Enquiry
              </a>
              {/* Book Consultancy replaces "Call us" */}
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-7 py-3.5 text-sm font-semibold text-primary hover:bg-primary/10 transition active:scale-[0.98]"
              >
                <CalendarDays className="h-4 w-4" /> Book Consultancy
              </button>
            </div>

            {/* Specifications Table */}
            <SpecTable specs={product.specs} />

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Genuine product · Authorized dealer
            </div>
          </div>
        </div>

        {/* Related Products Carousel (shown at the bottom for all screen sizes) */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                  Similar Products
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Explore other options in this category
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:bg-secondary active:scale-95 cursor-pointer"
                  aria-label="Previous products"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={scrollRight}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-soft transition hover:bg-secondary active:scale-95 cursor-pointer"
                  aria-label="Next products"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 snap-x scroll-smooth scrollbar-none"
              >
                {related.map((p, i) => (
                  <div key={p.id} className="w-[280px] shrink-0 snap-start">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile sticky bar: cart + wishlist + enquire + book ── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <MobileCartWishlistButtons product={product} />
          {/* WhatsApp */}
          <a
            href={whatsappLink(msg)}
            target="_blank"
            rel="noreferrer"
            className="relative overflow-hidden flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-white opacity-10"
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            />
            <MessageCircle className="h-3.5 w-3.5" /> Enquiry
          </a>
          {/* Book Consultancy */}
          <button
            onClick={() => setBookingOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 py-3 text-xs font-semibold text-primary transition hover:bg-primary/10 active:scale-95"
          >
            <CalendarDays className="h-3.5 w-3.5" /> Book
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        product={product}
      />
    </div>
  );
}
export default ProductDetail;
