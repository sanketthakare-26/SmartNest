import { useState, useEffect } from "react";
import { MessageCircle, Phone, Mail, MapPin, Check } from "lucide-react";
import { whatsappLink, PHONE_NUMBER, EMAIL, categories } from "../lib/data";
import { AnimatedSection } from "../components/common/AnimatedSection";
import { enquiriesApi } from "../lib/api";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: categories[0].slug, message: "" });
  const [loading, setLoading] = useState(false);

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
    const interestCategory = categories.find((c) => c.slug === form.interest);
    const interest = interestCategory?.name ?? "";

    try {
      // 1. Submit to the Express backend database
      await enquiriesApi.create({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message || undefined,
        category: interest,
      });
    } catch (err) {
      console.error("Failed saving enquiry to backend API:", err);
    } finally {
      setLoading(false);
    }

    // 2. Open WhatsApp link as primary channel
    const msg = `Hi SmartNest, I'm ${form.name}. I'm interested in ${interest}.\n\n${form.message}\n\nPhone: ${form.phone}\nEmail: ${form.email}`;
    window.open(whatsappLink(msg), "_blank");
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <AnimatedSection>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Contact</span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Let's build something smart.</h1>
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
                </select>
              </Field>
              <Field label="Tell us about your home" className="sm:col-span-2">
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="E.g. 3BHK apartment, need digital lock + 4 cameras + curtain automation in the master bedroom." className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary transition" />
              </Field>
            </div>

            <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95 disabled:opacity-50 sm:w-auto sm:px-8">
              <MessageCircle className="h-4 w-4" /> {loading ? "Saving enquiry..." : "Send via WhatsApp"}
            </button>

            {sent && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-mint-soft px-4 py-3 text-sm text-foreground animate-fade-in">
                <Check className="h-4 w-4 text-primary" /> Opened WhatsApp — please hit send in the chat to complete your enquiry.
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

      {/* Map Section */}
      <AnimatedSection delay={200} className="mt-12">
        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-card">
          <div className="border-b border-border bg-secondary/50 px-6 py-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider text-foreground/80">Our Experience Centre</span>
          </div>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.126447814983!2d88.428588!3d22.574347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCbDM0JzI3LjYiTiA4OMKwMjUnNDIuOSJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
            width="100%" 
            height="350" 
            style={{ border: 0, filter: "grayscale(0.1) contrast(1.05)" }} 
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="SmartNest Showroom Map"
            className="w-full"
          />
        </div>
      </AnimatedSection>
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
