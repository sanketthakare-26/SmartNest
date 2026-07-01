import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Wrench, Heart, Sparkles } from "lucide-react";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { useStore } from "../context/StoreContext";
import { BookingModal } from "../components/product/BookingModal";

const values = [
  { icon: ShieldCheck, title: "Genuine only", body: "Every product is sourced from authorized distributors — never grey-market." },
  { icon: Wrench, title: "Certified install", body: "Our in-house technicians are trained on every brand we sell." },
  { icon: Heart, title: "After-sale care", body: "24/7 phone & WhatsApp support, plus on-site service when you need it." },
  { icon: Sparkles, title: "Curated, not bloated", body: "We hand-pick the best in each category instead of selling everything." },
];

export function About() {
  const { brands, categories } = useStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    document.title = "About SmartNest — Premium Smart Home Specialists";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "We curate, install and support the world's best smart home brands — making automation effortless for premium homes."
      );
    }
  }, []);

  const stats = [
    { value: "500+", label: "Homes automated" },
    { value: `${brands.length || 20}+`, label: "Top brands" },
    { value: `${categories.length || 8}`, label: "Product categories" },
    { value: "4.9★", label: "Customer rating" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <AnimatedSection>
        <div className="overflow-hidden rounded-[2rem] bg-gradient-hero p-8 shadow-card sm:p-14">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">About SmartNest</span>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Building the calm, connected home.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            SmartNest is a premium smart home automation company helping homeowners, architects and builders bring intelligence into every room — beautifully.
          </p>
        </div>
      </AnimatedSection>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <AnimatedSection key={s.label} delay={i * 60}>
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-card">
              <div className="text-4xl font-extrabold tracking-tight text-foreground">{s.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          </AnimatedSection>
        ))}
      </section>

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <AnimatedSection>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Our story</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">From electricians to smart-home architects.</h2>
          <div className="mt-4 space-y-4 text-base text-muted-foreground">
            <p>SmartNest started in 2018 with one belief: smart homes shouldn't feel complicated. They should feel calm, intentional, and beautiful.</p>
            <p>What began as a small team installing CCTV and digital locks has grown into a full smart-home practice — partnering with the world's leading brands and serving hundreds of premium homes.</p>
            <p>We obsess over the details others skip: cable routing, panel alignment, scene design, and a follow-up call a week later.</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={120}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-base font-bold">{v.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="mt-20">
        <AnimatedSection>
          <div className="animate-gradient-shift overflow-hidden rounded-[2rem] bg-gradient-cta p-10 text-center shadow-lift sm:p-14">
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Let's plan your smart home.</h3>
            <p className="mx-auto mt-3 max-w-xl text-foreground/70">A free site visit, a curated proposal, and an install team that shows up on time.</p>
            <button 
              onClick={() => setBookingOpen(true)}
              className="mt-6 inline-flex rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background shadow-soft hover:opacity-90 transition active:scale-95"
            >
              Book a consultation
            </button>
          </div>
        </AnimatedSection>
      </section>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        product={{ name: "Home Automation Consultation" }}
      />
    </div>
  );
}
export default About;
