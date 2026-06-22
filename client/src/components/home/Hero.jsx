import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Zap, Sparkles } from "lucide-react";
import { animations } from "../../lib/animations";

const Hero = () => {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnsRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    const textEl = textRef.current;
    const btnEls = btnsRef.current ? btnsRef.current.children : [];
    const visualEl = visualRef.current;

    animations.heroEntrance(titleEl, textEl, btnEls, visualEl);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-6 md:px-12 bg-radial-gradient">
      {/* Background Ambient Glow Elements */}
      <div className="glow-point bg-primary top-[15%] left-[10%]" />
      <div className="glow-point bg-secondary bottom-[20%] right-[10%]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-primary font-medium w-fit">
            <Sparkles size={14} className="animate-spin text-primary" />
            <span>Intelligent Living, Redefined</span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            The Ultimate Ecosystem for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary">Smart Home</span>
          </h1>

          <p
            ref={textRef}
            className="text-base md:text-lg text-gray-400 max-w-xl"
          >
            Discover state-of-the-art smart home hubs, lighting automation systems, security arrays, and voice controllers. Seamlessly integrate your everyday environment.
          </p>

          <div ref={btnsRef} className="flex flex-wrap gap-4 mt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-dark font-semibold transition shadow-lg hover:shadow-primary/10"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-slate-800/40 text-white font-medium transition"
            >
              <Play size={18} className="fill-white text-white" />
              <span>Consult an Expert</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-900 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/10">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Secure Systems</h4>
                <p className="text-xs text-gray-500">Military-grade IoT keys</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/10">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Instant Response</h4>
                <p className="text-xs text-gray-500">Latency-free local hubs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Visual Mockup */}
        <div ref={visualRef} className="flex justify-center relative">
          <div className="relative glass-card p-2 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl transition-transform hover:scale-[1.01] duration-300">
            <img
              src="/hero-dashboard.png"
              alt="Futuristic Smart Home Dashboard"
              className="rounded-2xl w-full max-w-[560px] object-cover h-[350px] md:h-[400px] border border-slate-900"
            />
            {/* Glossy Overlay Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
