import React from "react";
import AnimatedSection from "../components/common/AnimatedSection";
import { Cpu, ShieldCheck, Heart, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Cpu className="text-primary w-6 h-6" />,
      title: "Pioneering Innovation",
      desc: "We curate only next-gen hardware supporting low-latency local hubs and modern Thread/Matter protocols.",
    },
    {
      icon: <ShieldCheck className="text-secondary w-6 h-6" />,
      title: "Privacy First",
      desc: "We believe smart homes shouldn't leak details. Our catalogs favor local processing and local encryption.",
    },
    {
      icon: <Heart className="text-primary w-6 h-6" />,
      title: "Human Design",
      desc: "Technology should dissolve into everyday routines. We design interfaces that are simple for all ages.",
    },
    {
      icon: <Users className="text-secondary w-6 h-6" />,
      title: "Expert Assistance",
      desc: "Our engineers bridge the gap between complex hardware configurations and your personal floor plan.",
    },
  ];

  return (
    <div className="py-16 px-6 md:px-12 max-w-5xl mx-auto text-left min-h-screen">
      {/* Intro */}
      <AnimatedSection className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Intelligent Spaces, Seamless Life.
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Founded in 2024, SmartNest was born out of a desire to make smart homes simpler, safer, and completely private. We curate and deliver state-of-the-art automation systems that sync perfectly with your environment.
        </p>
      </AnimatedSection>

      {/* Grid Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <AnimatedSection className="relative glass-card p-2 rounded-2xl border border-slate-900">
          <img
            src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
            alt="Smart home interior"
            className="rounded-xl w-full h-[320px] object-cover"
          />
        </AnimatedSection>

        <AnimatedSection className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The modern IoT landscape is cluttered with incompatible devices, complicated hubs, and constant cloud dependencies.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            SmartNest solves this by offering a handpicked catalog of compatible components and a centralized framework. From smart lighting controls to facial security locks, we make sure everything speaks the same language.
          </p>
        </AnimatedSection>
      </div>

      {/* Values */}
      <div className="border-t border-slate-900 pt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={idx * 0.1}
              className="flex items-start gap-4 p-5 rounded-2xl glass-card border border-slate-900"
            >
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
                {v.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-white font-bold text-sm tracking-wide">{v.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
