import React from "react";
import { ShieldCheck, Headphones, Wrench, EyeOff } from "lucide-react";
import AnimatedSection from "../common/AnimatedSection";

const TrustBadges = () => {
  const badges = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "3-Year Warranty",
      desc: "Guaranteed hardware reliability and component coverage.",
    },
    {
      icon: <EyeOff className="w-8 h-8 text-secondary" />,
      title: "Encrypted & Private",
      desc: "Local encryption key matching. No data leaves your home.",
    },
    {
      icon: <Wrench className="w-8 h-8 text-primary" />,
      title: "Professional Fitting",
      desc: "Optional expert installation and mesh calibration.",
    },
    {
      icon: <Headphones className="w-8 h-8 text-secondary" />,
      title: "Lifetime Support",
      desc: "24/7 technical troubleshooting for hubs and integrations.",
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-[#090D15] border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={idx * 0.1}
              className="flex items-start gap-4 p-5 rounded-2xl glass-card border border-slate-900 text-left"
            >
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
                {badge.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-white font-bold text-sm tracking-wide">
                  {badge.title}
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
