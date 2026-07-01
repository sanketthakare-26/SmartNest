import { Link } from "react-router-dom";
import {
  Facebook, Instagram, Linkedin, Youtube,
  Mail, Phone, ShieldCheck, HelpCircle, Info,
} from "lucide-react";
import { EMAIL, PHONE_NUMBER, whatsappLink } from "@/lib/data";
import logoImg from "@/assets/logo.jpg";



function FooterSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </div>
      <ul className="mt-4 space-y-2.5 text-sm text-white/60">
        {children}
      </ul>
    </div>
  );
}

function FL({ to, href, children }) {
  const cls = "hover:text-primary transition-colors duration-200";
  if (href)
    return <li><a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a></li>;
  return <li><Link to={to} className={cls}>{children}</Link></li>;
}

// ── MAIN FOOTER ───────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="mt-24 border-t border-border" style={{ background: "#172337", color: "#fff" }}>

      {/* ── TOP STRIP: Mail Us + Call Us ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="grid grid-cols-2 divide-x divide-white/10">
            {/* Mail Us */}
            <div className="pr-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">Mail Us</p>
              <p className="mt-1 text-xs text-white/55">
                SmartNest Tech Lab, Amravati, Maharashtra, India
              </p>
              <a href={`mailto:${EMAIL}`} className="mt-0.5 block text-xs text-primary hover:underline break-all">
                {EMAIL}
              </a>
            </div>
            {/* Call Us */}
            <div className="pl-6">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">Call Us</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/55">
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hover:text-primary transition">{PHONE_NUMBER}</a>
                <a href="tel:+917057953073" className="hover:text-primary transition">+91 7057953073</a>
                <span>Mon – Sat · 10 am – 7 pm</span>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="text-green-400 hover:underline">WhatsApp Us →</a>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── MAIN LINKS GRID ── */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1 lg:col-span-1">
          <Link to="/" className="inline-flex flex-col items-start gap-2 group">
            <img
              src={logoImg}
              alt="SmartNest logo"
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-primary transition"
            />
            <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-primary transition">
              SmartNest
            </span>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            Premium smart home automation — sourced from the world's best brands, installed by certified technicians.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/50 transition hover:bg-primary hover:text-white">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* About */}
        <FooterSection title="About" icon={Info}>
          <FL to="/contact">About SmartNest</FL>
          <FL to="/contact">Contact Us</FL>
          <FL to="/products">Our Products</FL>
          <FL to="/contact">Careers</FL>
          <FL to="/contact">Press</FL>
        </FooterSection>

        {/* Help Center */}
        <FooterSection title="Help Center" icon={HelpCircle}>
          <FL to="/faq">FAQs</FL>
          <FL to="/contact">Book a Site Visit</FL>
          <FL href={whatsappLink("Hi SmartNest, I need support.")}>WhatsApp Support</FL>
          <FL href={`mailto:${EMAIL}`}>Email Support</FL>
          <FL to="/contact">Book Appointment</FL>
        </FooterSection>

        {/* Consumer Policy */}
        <FooterSection title="Consumer Policy" icon={ShieldCheck}>
          <FL to="/terms">Terms of Use</FL>
          <FL to="/privacy">Privacy Policy</FL>
          <FL to="/terms">Cancellation & Returns</FL>
          <FL to="/terms">Security</FL>
          <FL to="/terms">Grievance Redressal</FL>
        </FooterSection>

        {/* Reach Us */}
        <FooterSection title="Reach Us" icon={Mail}>
          <li>
            <a href={`mailto:${EMAIL}`}
              className="block text-[11px] text-primary hover:underline break-all leading-snug">
              {EMAIL}
            </a>
          </li>
          <li>
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:text-primary transition">
              <Phone className="h-3.5 w-3.5 shrink-0" /> {PHONE_NUMBER}
            </a>
          </li>
          <li className="pt-2">
            <Link to="/contact"
              className="inline-block rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow hover:opacity-90 transition">
              Send Enquiry →
            </Link>
          </li>
        </FooterSection>
      </div>



      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
            <Link to="/" className="font-semibold text-white/60 hover:text-primary transition">SmartNest</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-primary transition">Terms</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-primary transition">Privacy</Link>
            <span>·</span>
            <Link to="/faq" className="hover:text-primary transition">FAQs</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-primary transition">Help Center</Link>
            <span>·</span>
            <a href={`mailto:${EMAIL}`} className="hover:text-primary transition">Mail Us</a>
          </div>
          <span className="text-xs text-white/30">
            © {new Date().getFullYear()} SmartNest. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
