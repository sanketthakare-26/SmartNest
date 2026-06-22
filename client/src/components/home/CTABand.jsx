import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import AnimatedSection from "../common/AnimatedSection";

const CTABand = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-primary/10 via-dark-card to-secondary/10 border-t border-b border-slate-900 overflow-hidden relative">
      <div className="glow-point bg-primary top-[-50px] right-[-50px] opacity-10" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-left">
        <AnimatedSection className="flex flex-col gap-3 max-w-xl">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <HelpCircle size={18} />
            <span>Confused about IoT compatibility?</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Get a Personalized Smart Home Blueprints Consultation
          </h3>
          <p className="text-gray-400 text-sm">
            Speak with an integration expert who will map out lighting, hubs, and climate controllers specifically configured for your floor plan.
          </p>
        </AnimatedSection>

        <AnimatedSection className="shrink-0">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-dark font-bold transition shadow-lg hover:shadow-primary/20 text-sm"
          >
            <span>Book Consultation</span>
            <ArrowRight size={16} />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTABand;
