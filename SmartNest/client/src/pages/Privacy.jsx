import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `When you use SmartNest's website or services, we may collect: personal identification information (name, email, phone number), device and usage data (IP address, browser type, pages visited), and information you submit through enquiry or contact forms.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to: process enquiries and appointment bookings, provide and improve our services, send transactional communications such as OTPs and booking confirmations, and respond to customer support requests. We do not sell or rent your personal information to third parties.`,
  },
  {
    title: "3. Cookies",
    body: `We use cookies and similar tracking technologies to enhance your browsing experience. Cookies help us remember your preferences and understand how visitors use our site. You can disable cookies in your browser settings, though some features may not function correctly without them.`,
  },
  {
    title: "4. Data Security",
    body: `We implement industry-standard security measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. All sensitive data such as passwords is stored in encrypted form. However, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "5. OTP & Email Communications",
    body: `When you use the Forgot Password feature, we send a One-Time Password (OTP) to your registered email address. This OTP is valid for 10 minutes and should not be shared with anyone. We will never ask for your OTP via call or message.`,
  },
  {
    title: "6. Third-Party Services",
    body: `We may use trusted third-party services for cloud storage (Cloudinary), database management (MongoDB Atlas), and analytics. These services have their own privacy policies and we encourage you to review them. We are not responsible for the privacy practices of third-party websites linked from our site.`,
  },
  {
    title: "7. Your Rights",
    body: `You have the right to access, update, or request deletion of your personal data held by SmartNest. To exercise these rights, contact us at smartnest.techlab@gmail.com. We will respond to all requests within 7 working days.`,
  },
  {
    title: "8. Children's Privacy",
    body: `Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 13, we will delete it promptly.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "last updated" date. We encourage you to review this page periodically to stay informed about how we protect your information.`,
  },
  {
    title: "10. Contact Us",
    body: `If you have any questions or concerns about this Privacy Policy, please contact us at smartnest.techlab@gmail.com or call +91 9604542530. Our office is open Monday to Saturday, 10 am – 7 pm.`,
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — SmartNest";
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Privacy Policy</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy Policy</h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: June 2026 · Your privacy is important to us. This policy explains how we handle your data.
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
