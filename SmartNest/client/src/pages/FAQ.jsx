import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, ChevronUp, ChevronRight, Search } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    label: "General",
    items: [
      {
        q: "What is SmartNest?",
        a: "SmartNest is a premium smart home automation company based in Pune, India. We supply and install CCTV systems, digital door locks, gate automation, curtain & blinds automation, lift automation, and touch panel controllers sourced from world-class brands.",
      },
      {
        q: "What areas do you serve?",
        a: "We currently serve Pune and nearby areas. Contact us to check availability for your specific location.",
      },
      {
        q: "Do you offer free site visits?",
        a: "Yes! We provide free site visits with no obligation. Our expert will assess your home and recommend the best automation solution tailored to your needs and budget.",
      },
      {
        q: "How can I reach SmartNest?",
        a: "You can reach us via phone at +91 9604542530, email at smartnest.techlab@gmail.com, or WhatsApp. Our office is open Monday to Saturday, 10 am – 7 pm.",
      },
    ],
  },
  {
    label: "Products & Installation",
    items: [
      {
        q: "Which brands do you carry?",
        a: "We carry products from leading brands including Hikvision, Dahua, CP Plus, Samsung, Godrej, Philips, Bosch, and Yale — all sourced from authorised distributors.",
      },
      {
        q: "How long does installation take?",
        a: "Most installations are completed within 1–3 working days depending on the scope. Larger projects (full home automation) may take up to a week.",
      },
      {
        q: "Do you install products not purchased from SmartNest?",
        a: "We primarily install products we supply to ensure quality, compatibility, and post-installation support. Contact us to discuss your specific requirements.",
      },
      {
        q: "Can I control my devices remotely?",
        a: "Absolutely. Our smart home systems support mobile app control, voice assistants (Alexa, Google Home), and remote access from anywhere in the world.",
      },
    ],
  },
  {
    label: "Orders & Payments",
    items: [
      {
        q: "How do I place an order?",
        a: "You can browse products on our website and submit an enquiry or book an appointment. Our team will then contact you to confirm the order, discuss customisation, and schedule installation.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, NEFT/RTGS, credit/debit cards, and cash. EMI options are also available on select products — ask our sales team for details.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders may be cancelled within 24 hours of confirmation. Once installation has begun, cancellations are subject to applicable labour charges.",
      },
      {
        q: "Do you offer any discounts?",
        a: "We offer seasonal promotions and bundle discounts for full-home automation packages. Contact us to know about ongoing offers.",
      },
    ],
  },
  {
    label: "Warranty & Support",
    items: [
      {
        q: "Is there a warranty on products?",
        a: "Yes. All products carry the original manufacturer's warranty (typically 1–3 years). SmartNest also provides 6-month post-installation support for workmanship defects.",
      },
      {
        q: "How do I claim warranty?",
        a: "Contact us at smartnest.techlab@gmail.com or call +91 9604542530 with your order details and a description of the issue. We will coordinate with the manufacturer on your behalf.",
      },
      {
        q: "What if a product is faulty after installation?",
        a: "If any product is found defective within 7 days of installation, we will replace it at no cost. For issues arising later, our service team will assess and handle the warranty claim.",
      },
      {
        q: "Do you offer Annual Maintenance Contracts (AMC)?",
        a: "Yes, we offer AMC plans for CCTV systems and other automation products. Please contact us to get a custom quote based on your installed systems.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "FAQs — SmartNest Help Center";
  }, []);

  const filtered = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      ({ q, a }) =>
        !query ||
        q.toLowerCase().includes(query.toLowerCase()) ||
        a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>FAQs</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Help Center & FAQs</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Find answers to the most common questions about SmartNest products, installation, and support.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary transition shadow-sm"
        />
      </div>

      {/* FAQ Categories */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No results found for "<strong>{query}</strong>". Try a different search term or{" "}
          <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
        </div>
      ) : (
        <div className="space-y-8">
          {filtered.map((cat, ci) => (
            <div key={ci} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-secondary/30 px-6 py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{cat.label}</span>
              </div>
              <div className="px-6">
                {cat.items.map((item, ii) => (
                  <FAQItem key={ii} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still need help CTA */}
      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <HelpCircle className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 text-lg font-bold">Still have questions?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team is available Monday – Saturday, 10 am to 7 pm.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition">
            Contact Us
          </Link>
          <a href="mailto:smartnest.techlab@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition">
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
