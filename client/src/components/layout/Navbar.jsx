import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X, Search, Heart, ShoppingCart, ChevronRight, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useStore } from "../../context/StoreContext";
import { useUserAuth } from "../../context/UserAuthContext";
import { AuthModal } from "../common/AuthModal";
import logoImg from "@/assets/logo.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  // Autocomplete suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const accountDropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  
  const { cart, cartCount, removeFromCart, wishlist, wishlistCount, toggleWishlist } = useCart();
  const { products, categories, brands } = useStore();
  const { user, isAuthenticated, logout } = useUserAuth();

  const isActive = (to) => {
    if (to === "/") return activePath === "/";
    return activePath.startsWith(to);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    setAccountOpen(false);
    setSearchOpen(false);
    setOpen(false);
  }, [location.pathname]);

  // Autocomplete suggestions generator
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const matched = [];

    // 1. Matches in brands
    brands.forEach((b) => {
      if (b.name.toLowerCase().includes(query)) {
        matched.push({ type: "brand", text: b.name, value: b.name });
      }
    });

    // 2. Matches in categories
    categories.forEach((c) => {
      if (c.name.toLowerCase().includes(query)) {
        matched.push({ type: "category", text: c.name, value: c.name });
      }
    });

    // 3. Matches in product names
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(query)) {
        matched.push({ type: "product", text: p.name, value: p.name });
      }
    });

    // Deduplicate
    const seen = new Set();
    const unique = [];
    for (const item of matched) {
      const lowerVal = item.value.toLowerCase();
      if (!seen.has(lowerVal)) {
        seen.add(lowerVal);
        unique.push(item);
      }
    }

    // Sort: exact first, starts-with next, then contains
    const sorted = unique.sort((a, b) => {
      const aLower = a.value.toLowerCase();
      const bLower = b.value.toLowerCase();
      const aExact = aLower === query;
      const bExact = bLower === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aLower.startsWith(query);
      const bStarts = bLower.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return aLower.localeCompare(bLower);
    });

    setSuggestions(sorted.slice(0, 8));
  }, [searchQuery, products, categories, brands]);

  // Handle clicking outside to close panels
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = searchQuery.trim();
    if (activeSuggestionIndex > -1 && suggestions[activeSuggestionIndex]) {
      query = suggestions[activeSuggestionIndex].value;
    }
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSearchOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (val) => {
    navigate(`/products?search=${encodeURIComponent(val)}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setSearchOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const isHome = activePath === "/";
  // The navbar is now always dark-themed (white text and elements)
  // because its background is either transparent over the dark hero image or solid black.
  const isNavbarDark = true;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        isHome && !scrolled
          ? "border-b border-transparent bg-transparent py-3"
          : "border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-md py-2 shadow-md"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">

        {/* ── Logo + Name ─────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logoImg}
            alt="SmartNest Logo"
            className="h-9 w-9 rounded-xl object-cover shadow-soft transition-transform duration-300 group-hover:scale-105"
          />
          <span className={cn(
            "text-lg font-extrabold tracking-tight transition-all duration-500 group-hover:translate-x-0.5",
            isNavbarDark ? "text-white drop-shadow" : "text-foreground"
          )}>
            SmartNest
          </span>
        </Link>

        {/* ── Search Bar (desktop — sits right of logo) ────────── */}
        <div ref={searchContainerRef} className="relative hidden md:flex flex-1 max-w-sm">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none transition-colors duration-300",
                isNavbarDark ? "text-white/70" : "text-muted-foreground"
              )} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className={cn(
                  "h-9 w-full rounded-full pl-9 pr-4 text-sm outline-none transition-all",
                  isNavbarDark
                    ? "border border-white/30 bg-white/15 text-white placeholder:text-white/60 focus:border-white/60 focus:bg-white/20 backdrop-blur-sm"
                    : "border border-border bg-secondary/40 placeholder:text-muted-foreground focus:border-primary focus:bg-background"
                )}
              />
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 top-11 z-50 rounded-2xl border border-border bg-card shadow-lift overflow-hidden"
              >
                <ul className="py-1">
                  {suggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSuggestionClick(item.value)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer select-none transition",
                        idx === activeSuggestionIndex
                          ? "bg-secondary text-foreground"
                          : "text-foreground/80 hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="flex-1 truncate">{item.text}</span>
                      {item.type && (
                        <span className="text-[10px] font-semibold text-primary/75 bg-primary/5 px-2 py-0.5 rounded-full capitalize">
                          {item.type}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Nav Links ────────────────────────────────────────── */}
        <nav className="hidden items-center gap-0.5 md:flex ml-auto">
          {links.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isNavbarDark
                    ? active ? "text-white font-semibold" : "text-white/80 hover:text-white hover:bg-white/10"
                    : active ? "text-foreground font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-secondary/40"
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="active-nav-underline"
                    className={cn(
                      "absolute inset-0 z-[-1] rounded-full shadow-sm",
                      isNavbarDark ? "bg-white/15" : "bg-secondary"
                    )}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* ── Wishlist Icon ──────────────────────────────────── */}
          <div className="relative ml-1">
            <Link
              to="/wishlist"
              id="wishlist-btn"
              aria-label="Wishlist"
              className={cn(
                "relative grid h-9 w-9 place-items-center rounded-full border transition active:scale-95",
                isNavbarDark
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  : "border-border bg-card text-foreground/70 hover:text-foreground hover:bg-secondary"
              )}
            >
              <Heart className={cn("h-4 w-4 transition", wishlistCount > 0 && "fill-rose-500 text-rose-500")} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          {/* ── Cart Icon ──────────────────────────────────────── */}
          <div className="relative ml-1">
            <Link
              to="/cart"
              id="cart-btn"
              aria-label="Cart"
              className={cn(
                "relative grid h-9 w-9 place-items-center rounded-full border transition active:scale-95",
                isNavbarDark
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  : "border-border bg-card text-foreground/70 hover:text-foreground hover:bg-secondary"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* ── Account Icon (right side of Cart) ──────────────── */}
          <div className="relative ml-1" ref={accountDropdownRef}>
            <button
              id="account-btn"
              aria-label="Account"
              onClick={() => {
                if (isAuthenticated) {
                  setAccountOpen((v) => !v);
                } else {
                  setAuthModalTab("login");
                  setAuthModalOpen(true);
                }
              }}
              className={cn(
                "relative grid h-9 w-9 place-items-center rounded-full border transition active:scale-95",
                isNavbarDark
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  : "border-border bg-card text-foreground/70 hover:text-foreground hover:bg-secondary"
              )}
            >
              {isAuthenticated ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>

            <AnimatePresence>
              {accountOpen && isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-60 rounded-2xl border border-border bg-card shadow-lift overflow-hidden p-4"
                >
                  <div className="border-b border-border pb-3 mb-3">
                    <p className="font-bold text-sm text-foreground line-clamp-1">Hello, {user.name}!</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setAccountOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold py-2 hover:bg-destructive/20 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── Mobile: search + hamburger ──────────────────────── */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          <button
            aria-label="Search"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl border transition active:scale-95",
              isNavbarDark
                ? "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                : "border-border bg-card hover:bg-secondary"
            )}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Open menu"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl border transition active:scale-95",
              isNavbarDark
                ? "border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                : "border-border bg-card hover:bg-secondary"
            )}
            onClick={() => setOpen(true)}
          >
            <Menu className={cn("h-5 w-5", isNavbarDark ? "text-white" : "text-foreground")} />
          </button>
        </div>
      </div>

      {/* ── Mobile Search Bar ──────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="relative p-3 bg-white dark:bg-zinc-950">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products..."
                    className="h-10 w-full rounded-full border border-border bg-secondary/40 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background transition-all"
                  />
                </div>
              </form>

              {/* Mobile Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="mt-2 max-h-56 overflow-y-auto rounded-2xl border border-border bg-card shadow-soft">
                  <ul className="py-1 divide-y divide-border/40">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => handleSuggestionClick(item.value)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition",
                          idx === activeSuggestionIndex
                            ? "bg-secondary text-foreground font-semibold"
                            : "text-foreground/80 active:bg-secondary"
                        )}
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate">{item.text}</span>
                        {item.type && (
                          <span className="text-[9px] font-bold text-primary/75 bg-primary/5 px-2 py-0.5 rounded-full capitalize">
                            {item.type}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-foreground/35 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white dark:bg-zinc-950 p-6 shadow-lift"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <img src={logoImg} alt="SmartNest" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="text-lg font-extrabold">SmartNest</span>
                </Link>
                <button
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-secondary transition active:scale-95"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 flex flex-col gap-1">
                {links.map((l) => {
                  const active = isActive(l.to);
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-4 text-lg font-semibold transition",
                        active ? "bg-secondary text-foreground" : "text-foreground/80 hover:bg-secondary/50"
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User profile action in mobile drawer */}
              <div className="mt-6 border-t border-border pt-6">
                {isAuthenticated ? (
                  <div className="rounded-2xl bg-secondary/35 p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-sm font-bold text-foreground line-clamp-1">Hello, {user.name}!</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-destructive/10 text-destructive text-xs font-semibold py-2.5 hover:bg-destructive/20 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAuthModalTab("login");
                      setAuthModalOpen(true);
                      setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full rounded-2xl border border-border bg-card py-3.5 text-sm font-bold text-foreground transition hover:bg-secondary"
                  >
                    <User className="h-4 w-4" /> Sign In / Register
                  </button>
                )}
              </div>

              {/* Wishlist & Cart buttons */}
              <div className="mt-auto flex gap-3">
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border py-4 text-xs font-semibold transition hover:bg-secondary"
                >
                  <Heart className="h-4 w-4 text-rose-500" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-xs font-semibold text-background transition hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" /> Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* User Login/Signup swiping modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </header>
  );
}
