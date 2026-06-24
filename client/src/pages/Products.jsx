import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/product/ProductCard";

export function Products() {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQueryParam = searchParams.get("search") || "";
  const [q, setQ] = useState(searchQueryParam);
  const [cat, setCat] = useState(null);
  const [brand, setBrand] = useState(null);

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
        (!term || p.name.toLowerCase().includes(term) || p.shortDescription.toLowerCase().includes(term)),
    );
  }, [q, cat, brand]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Catalog</span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All products</h1>
        <p className="max-w-xl text-muted-foreground">Filter and search across {products.length}+ smart home products from {brands.length} brands.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by product, e.g. Hikvision dome"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-card outline-none transition focus:border-primary"
          />
        </div>

        <FilterRow label="Category" active={cat} onClear={() => setCat(null)} items={categories.map((c) => ({ key: c.slug, label: c.name }))} onPick={setCat} />
        <FilterRow label="Brand" active={brand} onClear={() => setBrand(null)} items={brands.map((b) => ({ key: b.slug, label: b.name }))} onPick={setBrand} />
      </div>

      <div className="mt-3 text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 && "s"}</div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-base font-semibold">No products match your filters.</p>
          <button
            onClick={() => {
              handleSearchChange("");
              setCat(null);
              setBrand(null);
            }}
            className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, active, onClear, items, onPick }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-2 hidden w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:block">{label}</div>
      <div className="flex flex-1 flex-wrap gap-2">
        <button
          onClick={onClear}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${!active ? "bg-foreground text-background" : "border border-border bg-card text-foreground/70 hover:bg-secondary"}`}
        >
          All
        </button>
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onPick(it.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${active === it.key ? "bg-foreground text-background" : "border border-border bg-card text-foreground/70 hover:bg-secondary"}`}
          >
            {it.label}
            {active === it.key && <X className="ml-1 inline h-3 w-3" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Products;
