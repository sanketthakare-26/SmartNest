import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the SmartNest website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
  },
  {
    title: "2. Products & Services",
    body: `SmartNest provides smart home automation products and installation services including CCTV systems, digital door locks, gate automation, curtain automation, lift automation, and touch panels. Product availability and specifications are subject to change without notice.`,
  },
  {
    title: "3. Orders & Pricing",
    body: `All prices displayed are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. SmartNest reserves the right to modify prices at any time. Enquiries and bookings submitted through the website are not confirmed orders until verified by our team.`,
  },
  {
    title: "4. Installation & Site Visits",
    body: `Free site visits are offered at our discretion and are subject to geographical availability. Installation timelines are estimates and may vary depending on project complexity, product availability, and site conditions.`,
  },
  {
    title: "5. Cancellation & Returns",
    body: `Orders may be cancelled within 24 hours of confirmation. Once installation has begun, cancellations are subject to applicable labour charges. Products can be returned within 7 days of delivery if they are defective and in original packaging. Custom-ordered or installed products are not eligible for return.`,
  },
  {
    title: "6. Warranty",
    body: `All products carry the original manufacturer's warranty (typically 1–3 years). SmartNest additionally provides 6-month post-installation support for workmanship defects. Warranty claims for products must be submitted to us directly, and we will coordinate with the manufacturer on your behalf.`,
  },
  {
    title: "7. Limitation of Liability",
    body: `SmartNest shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our maximum liability in any event shall not exceed the amount paid by you for the specific product or service in question.`,
  },
  {
    title: "8. Intellectual Property",
    body: `All content on this website, including text, images, logos, and design elements, is the property of SmartNest and is protected by applicable copyright and trademark laws. You may not reproduce or distribute any content without written permission.`,
  },
  {
    title: "9. Governing Law",
    body: `These terms are governed by the laws of the State of Maharashtra, India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra.`,
  },
  {
    title: "10. Contact for Grievance",
    body: `If you have any grievance regarding our products or services, please contact our Grievance Officer at smartnest.techlab@gmail.com or call +91 9604542530. We aim to resolve all complaints within 7 working days.`,
  },
];

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Use — SmartNest";
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Terms of Use</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Terms of Use</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: June 2026 · Please read these terms carefully before using our services.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-base font-bold text-foreground">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:opacity-90 transition">
          Have a question? Contact Us
        </Link>
      </div>
    </div>
  );
}
