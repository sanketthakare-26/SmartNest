import { AnimatedSection } from "../common/AnimatedSection";
import { ProductCard } from "../product/ProductCard";

export function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-8 flex flex-col gap-2 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</span>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
            {subtitle && <p className="max-w-xl text-muted-foreground">{subtitle}</p>}
          </div>
        </AnimatedSection>
        {children}
      </div>
    </section>
  );
}

export function ProductRow({ eyebrow, title, items }) {
  return (
    <Section eyebrow={eyebrow} title={title}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {items.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id || p._id} product={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
