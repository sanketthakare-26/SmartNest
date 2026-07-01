import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "../components/product/ProductCard";

export function Brand() {
  const { getBrand, productsByBrand } = useStore();
  const { slug } = useParams();
  const brand = getBrand(slug);

  useEffect(() => {
    if (brand) {
      document.title = `${brand.name} — SmartNest`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", `Explore ${brand.name} products at SmartNest.`);
    }
  }, [brand]);

  if (!brand) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Brand not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The brand you requested is not found.</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-soft transition hover:opacity-90">
          Browse all products
        </Link>
      </div>
    );
  }

  const items = productsByBrand(brand.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>
      <div className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-cta p-8 shadow-card sm:p-12">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">Brand</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">{brand.name}</h1>
        <p className="mt-3 max-w-xl text-foreground/70">Discover {items.length} {brand.name} products available at SmartNest, with certified installation and full warranty.</p>
      </div>
      {items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-base font-semibold">No products listed for {brand.name} yet.</p>
          <Link to="/contact" className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">Request a quote</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
export default Brand;
