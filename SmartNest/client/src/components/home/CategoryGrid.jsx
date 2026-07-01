import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { AnimatedSection } from "../common/AnimatedSection";

export function CategoryGrid() {
  const { categories } = useStore();
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
      {categories.map((c, i) => (
        <AnimatedSection key={c.slug} delay={i * 60}>
          <Link
            to={`/category/${c.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground/85 px-3 py-2 text-center text-xs font-semibold text-background transition duration-300 group-hover:translate-y-0">
                View Products →
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="text-sm font-bold text-foreground sm:text-base">{c.name}</div>
              <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.tagline}</div>
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
