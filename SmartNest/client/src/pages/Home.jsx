import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Hero } from "../components/home/Hero";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { ProductRow } from "../components/home/ProductRow";
import { CTABand } from "../components/home/CTABand";
import { Section } from "../components/home/ProductRow";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { useStore } from "../context/StoreContext";

export function Home() {
  const { featuredProducts, topSelling, trending, brands } = useStore();

  useEffect(() => {
    document.title = "SmartNest — Premium Smart Home Automation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "CCTV, digital door locks, gate & curtain automation, smart panels and more. Curated from the world's top brands and installed by certified technicians."
      );
    }
  }, []);

  return (
    <div>
      {/* HERO — fullscreen split-reveal */}
      <Hero />

      {/* CATEGORIES */}
      <Section
        eyebrow="Categories"
        title="Everything for the connected home"
        subtitle="From entry to ambience — automate every corner."
      >
        <CategoryGrid />
      </Section>

      {/* FEATURED */}
      <ProductRow eyebrow="Featured" title="Curated for premium homes" items={featuredProducts} />
      <ProductRow eyebrow="Top selling" title="What our customers love" items={topSelling} />
      <ProductRow eyebrow="Trending" title="Hot right now" items={trending} />

      {/* BRANDS */}
      <Section eyebrow="Brands" title={`${brands.length || 20}+ top brands under one roof`}>
        <div className="flex flex-wrap gap-2">
          {brands.map((b, i) => (
            <AnimatedSection key={b.slug} delay={i * 25}>
              <Link
                to={`/brand/${b.slug}`}
                className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground/80 shadow-card transition hover:-translate-y-0.5 hover:bg-secondary hover:text-foreground"
              >
                {b.name}
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CTABand />
    </div>
  );
}

export default Home;
