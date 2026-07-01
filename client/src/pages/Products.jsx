import { useEffect, useMemo, useState, useRef } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Products() {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("search") || "";
  const [q, setQ] = useState(searchQueryParam);
  const [cat, setCat] = useState(null);
  const [brand, setBrand] = useState(null);

  // Price range state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);

  useEffect(() => {
    setQ(searchQueryParam);
  }, [searchQueryParam]);

  const handleSearchChange = (val) => {
    setQ(val);
    if (val.trim()) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    document.title = "All Products — SmartNest";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Browse our full catalog of smart home products. Filter by category, brand or search by name."
      );
    }
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!cat || p.categorySlug === cat) &&
        (!brand || p.brand === brand) &&
        (p.price >= minPrice && p.price <= maxPrice) &&
        (!term || p.name.toLowerCase().includes(term) || p.shortDescription.toLowerCase().includes(term))
    );
  }, [q, cat, brand, minPrice, maxPrice]);

  const isFiltered = cat || brand || q.trim() || minPrice > 0 || maxPrice < 150000;

  const handleClearAll = () => {
    handleSearchChange("");
    setCat(null);
    setBrand(null);
    setMinPrice(0);
    setMaxPrice(150000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      {/* Title block with responsive Price Filter on the right */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Catalog</span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All products</h1>
          <p className="max-w-xl text-muted-foreground">
            Filter and search across {products.length}+ smart home products from {brands.length} brands.
          </p>
        </div>
        <div className="self-start md:self-end z-20">
          <PriceFilterDropdown
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            defaultMin={0}
            defaultMax={150000}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by product, e.g. Hikvision dome"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-card outline-none transition focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="Category"
            active={cat}
            onClear={() => setCat(null)}
            items={categories.map((c) => ({ key: c.slug, label: c.name }))}
            onPick={setCat}
            placeholder="All Categories"
          />
          <FilterDropdown
            label="Brand"
            active={brand}
            onClear={() => setBrand(null)}
            items={brands.map((b) => ({ key: b.slug, label: b.name }))}
            onPick={setBrand}
            placeholder="All Brands"
          />
          {isFiltered && (
            <button
              onClick={handleClearAll}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-dashed border-destructive/30 px-5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition active:scale-95"
            >
              Clear Filters <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 && "s"}</div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-base font-semibold">No products match your filters.</p>
          <button
            onClick={handleClearAll}
            className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background shadow-soft hover:opacity-90 transition"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ label, active, onClear, items, onPick, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeItem = items.find((it) => it.key === active);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex h-12 items-center justify-between gap-2 rounded-full border px-5 text-sm font-semibold shadow-card transition-all active:scale-95",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:bg-secondary"
        )}
      >
        <span>{activeItem ? activeItem.label : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 z-30 max-h-72 w-64 overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-lift scrollbar-thin"
          >
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors",
                !active ? "bg-secondary font-bold text-foreground" : "text-foreground/85 hover:bg-secondary/40 hover:text-foreground"
              )}
            >
              <span>All {label}s</span>
              {!active && <Check className="h-4 w-4 text-primary" />}
            </button>
            <div className="h-px bg-border my-1" />
            {items.map((it) => (
              <button
                key={it.key}
                onClick={() => {
                  onPick(it.key);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors",
                  active === it.key ? "bg-secondary font-bold text-foreground" : "text-foreground/85 hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <span className="truncate">{it.label}</span>
                {active === it.key && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriceFilterDropdown({ minPrice, maxPrice, setMinPrice, setMaxPrice, defaultMin, defaultMax }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFiltered = minPrice > defaultMin || maxPrice < defaultMax;

  const presets = [
    { label: "Up to ₹1,900", min: 0, max: 1900 },
    { label: "₹1,900 - ₹4,300", min: 1900, max: 4300 },
    { label: "₹4,300 - ₹7,000", min: 4300, max: 7000 },
    { label: "₹7,000 - ₹13,000", min: 7000, max: 13000 },
    { label: "Over ₹13,000", min: 13000, max: 150000 },
  ];

  const minPercent = ((minPrice - defaultMin) / (defaultMax - defaultMin)) * 100;
  const maxPercent = ((maxPrice - defaultMin) / (defaultMax - defaultMin)) * 100;

  const handleReset = () => {
    setMinPrice(defaultMin);
    setMaxPrice(defaultMax);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex h-12 items-center justify-between gap-2 rounded-full border px-5 text-sm font-semibold shadow-card transition-all active:scale-95",
          isFiltered
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:bg-secondary"
        )}
      >
        <span>
          {isFiltered
            ? `Price: ₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice > 140000 ? "1.5L+" : maxPrice.toLocaleString("en-IN")}`
            : "Price Filter"}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 z-30 w-72 rounded-3xl border border-border bg-card p-6 shadow-lift"
          >
            {/* Styles inline to support custom slider track highlights */}
            <style dangerouslySetInnerHTML={{ __html: `
              .dual-slider-container input[type="range"]::-webkit-slider-thumb {
                pointer-events: auto;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 5px solid oklch(0.72 0.13 230);
                cursor: pointer;
                appearance: none;
                -webkit-appearance: none;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                transition: transform 0.1s ease;
              }
              .dual-slider-container input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
              }
              .dual-slider-container input[type="range"]::-moz-range-thumb {
                pointer-events: auto;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 5px solid oklch(0.72 0.13 230);
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                transition: transform 0.1s ease;
              }
              .dual-slider-container input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.1);
              }
            `}} />

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</span>
              <span className="text-lg font-bold text-foreground">
                ₹{minPrice.toLocaleString("en-IN")} – ₹{maxPrice > 140000 ? "1,50,000+" : maxPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Slider track container */}
            <div className="relative w-full h-1.5 bg-secondary rounded-full mt-6 mb-3 dual-slider-container">
              {/* Colored active range track */}
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{
                  left: `${minPercent}%`,
                  width: `${maxPercent - minPercent}%`,
                }}
              />
              <input
                type="range"
                min={defaultMin}
                max={defaultMax}
                value={minPrice}
                step={500}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxPrice - 1000);
                  setMinPrice(val);
                }}
                className="absolute pointer-events-none appearance-none w-full h-1.5 bg-transparent outline-none left-0 top-0"
              />
              <input
                type="range"
                min={defaultMin}
                max={defaultMax}
                value={maxPrice}
                step={500}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), minPrice + 1000);
                  setMaxPrice(val);
                }}
                className="absolute pointer-events-none appearance-none w-full h-1.5 bg-transparent outline-none left-0 top-0"
              />
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-semibold text-primary hover:underline transition"
            >
              Reset price range
            </button>

            {/* Preset ranges */}
            <div className="mt-5 flex flex-col gap-2.5">
              {isFiltered && (
                <button
                  onClick={handleReset}
                  className="flex items-center text-xs font-bold text-muted-foreground hover:text-foreground transition text-left"
                >
                  &lt; Clear
                </button>
              )}
              {presets.map((preset) => {
                const isActive = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                    }}
                    className={cn(
                      "text-sm text-left transition-colors font-medium py-0.5",
                      isActive
                        ? "text-primary font-bold"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Products;
