import { Link } from "react-router-dom";
import { AnimatedSection } from "../common/AnimatedSection";

export function CTABand() {
  return (
    <section className="px-4 pb-24 pt-8 sm:px-6">
      <AnimatedSection className="mx-auto max-w-7xl">
        <div className="animate-gradient-shift relative overflow-hidden rounded-[2.5rem] bg-gradient-cta p-8 shadow-lift sm:p-14">
          <div className="relative z-10 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to automate <br className="hidden sm:block" />your home?
              </h2>
              <p className="mt-4 max-w-xl text-foreground/70">
                Free site visit, no-obligation quote, and a curated package built around your home and budget.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link to="/contact" className="rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-background shadow-soft hover:opacity-90">
                Send Enquiry
              </Link>
              <Link to="/products" className="rounded-full bg-background/80 px-6 py-3 text-center text-sm font-semibold text-foreground backdrop-blur hover:bg-background">
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
