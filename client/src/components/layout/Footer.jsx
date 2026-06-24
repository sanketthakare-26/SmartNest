import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { EMAIL, PHONE_NUMBER } from "@/lib/data";

export function Footer() {
  const { categories, brands } = useStore();
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="text-xl font-extrabold">SmartNest</div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Premium smart home automation — sourced from the world's best brands, installed by certified technicians.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground/70 transition hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/80">Categories</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} className="hover:text-foreground">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/80">Top Brands</div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {brands.slice(0, 8).map((b) => (
              <li key={b.slug}>
                <Link to={`/brand/${b.slug}`} className="hover:text-foreground">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/80">Reach us</div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> {PHONE_NUMBER}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> {EMAIL}
            </li>
            <li>
              <Link to="/contact" className="inline-block rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background">
                Send Enquiry
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} SmartNest. All rights reserved.</span>
          <span>Crafted for premium smart homes.</span>
        </div>
      </div>
    </footer>
  );
}
