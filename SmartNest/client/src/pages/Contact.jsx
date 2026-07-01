import { useState, useEffect } from "react";
import { Send, MessageCircle, Phone, Mail, MapPin, Check } from "lucide-react";
import { whatsappLink, PHONE_NUMBER, EMAIL, categories as staticCategories } from "../lib/data";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { enquiriesApi } from "../lib/api";
import { useStore } from "../context/StoreContext";

export function Contact() {
  const { categories: dbCategories } = useStore() || { categories: [] };
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : staticCategories;

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: categories[0]?.slug || "other", message: "" });
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact SmartNest — Free Smart Home Consultation";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Send us an enquiry, chat on WhatsApp or call us directly. Free site visit and no-obligation quote."
      );
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Determine the interest category name
    let interest = "";
    if (form.interest === "other") {
      interest = customInterest.trim() || "Other";
    } else {
      const interestCategory = categories.find((c) => c.slug === form.interest);
      interest = interestCategory?.name ?? form.interest;
    }

    try {
      // Submit enquiry to the backend API
      await enquiriesApi.create({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message || undefined,
        category: interest,
      });
      setSent(true);
      // Reset form
      setForm({ name: "", phone: "", email: "", interest: categories[0]?.slug || "other", message: "" });
      setCustomInterest("");
    } catch (err) {
      console.error("Failed saving enquiry to backend API:", err);
      setError("Something went wrong. Please try again or contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <AnimatedSection>
        <div className="max-w-3xl mb-8">
          {/* Blue, bold, and uppercase CONTACT title replacing 'Let's build something smart.' */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-primary uppercase">
            CONTACT
          </h1>
          <p className="mt-3 text-base text-muted-foreground">Tell us about your home and we'll design a package that fits. Free site visit, no obligation.</p>
        </div>
      </AnimatedSection>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <AnimatedSection>
          <form onSubmit={onSubmit} className="rounded-[2rem] border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition" />
              </Field>
              <Field label="Phone">
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition" />
              </Field>
              <Field label="Email" className="sm:col-span-2">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition" />
              </Field>
              <Field label="Interested in" className="sm:col-span-2">
                <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                  <option value="other">Other / General Enquiry</option>
                </select>
              </Field>
              {form.interest === "other" && (
                <Field label="Specify your interest" className="sm:col-span-2">
                  <input required value={customInterest} onChange={(e) => setCustomInterest(e.target.value)} placeholder="E.g., Custom lighting, smart mirrors..." className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary transition" />
                </Field>
              )}
              <Field label="Tell us about your home" className="sm:col-span-2">
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="E.g. 3BHK apartment, need digital lock + 4 cameras + curtain automation in the master bedroom." className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition" />
              </Field>
            </div>

            <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95 disabled:opacity-50 sm:w-auto sm:px-8">
              <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Enquiry"}
            </button>

            {sent && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-mint-soft px-4 py-3 text-sm text-foreground animate-fade-in">
                <Check className="h-4 w-4 text-primary" /> Enquiry sent! We'll get back to you within 2 working hours.
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}
          </form>
        </AnimatedSection>

        {/* Info */}
        <AnimatedSection delay={120}>
          <div className="flex flex-col gap-4">
            <InfoCard icon={Phone} title="Call us" body={PHONE_NUMBER} href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} />
            <InfoCard icon={MessageCircle} title="WhatsApp" body="Tap to start a chat" href={whatsappLink()} accent />
            <InfoCard icon={Mail} title="Email" body={EMAIL} href={`mailto:${EMAIL}`} />
            <InfoCard icon={MapPin} title="Showroom" body="Open Mon–Sat · 10am–7pm" />
            <div className="rounded-3xl border border-border bg-gradient-hero p-6 shadow-card">
              <div className="text-sm font-bold uppercase tracking-wider text-primary">Promise</div>
              <p className="mt-2 text-sm text-foreground/80">We reply to every enquiry within 2 working hours. Free site visit anywhere in city limits.</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

function Field({ label, className = "", children }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function InfoCard({ icon: Icon, title, body, href, accent }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-3xl border border-border p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift ${accent ? "bg-mint-soft border-mint-soft" : "bg-card"}`}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-base font-semibold text-foreground">{body}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}

export default Contact;
