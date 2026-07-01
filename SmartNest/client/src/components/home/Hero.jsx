import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import curtainHeroImg from "@/assets/cat-curtain.jpg";
import { useStore } from "@/context/StoreContext";

// Local category images as reliable fallback pool
import cctv from "@/assets/cat-cctv.jpg";
import lock from "@/assets/cat-lock.jpg";
import gate from "@/assets/cat-gate.jpg";
import curtain from "@/assets/cat-curtain.jpg";
import lift from "@/assets/cat-lift.jpg";
import touch from "@/assets/cat-touch.jpg";
import sensor from "@/assets/cat-sensor.jpg";
import kit from "@/assets/cat-kit.jpg";
import hero from "@/assets/hero.jpg";
import hero2 from "@/assets/hero image 2.jpg";
import hero3 from "@/assets/hero image 3.jpg";
import hero4 from "@/assets/hero image 4.jpg";

gsap.registerPlugin(ScrollTrigger);

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Resolve a product image URL to something displayable
function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.startsWith("/uploads/") || src.startsWith("uploads/")) return `${BASE_URL}/${src.replace(/^\//, "")}`;
  return null;
}

// Deterministic scatter positions for up to 12 cards
const POSITIONS = [
  { x: -42, y: -38, rot: -12, scale: 0.88 },
  { x:  38, y: -42, rot:  10, scale: 0.92 },
  { x: -48, y:  10, rot:  -8, scale: 0.85 },
  { x:  44, y:  14, rot:  14, scale: 0.90 },
  { x: -20, y:  40, rot:  -6, scale: 0.87 },
  { x:  22, y:  38, rot:   9, scale: 0.93 },
  { x: -36, y: -14, rot:  16, scale: 0.86 },
  { x:  34, y: -18, rot: -11, scale: 0.91 },
  { x:   0, y: -44, rot:   5, scale: 0.89 },
  { x:   0, y:  42, rot:  -5, scale: 0.88 },
  { x: -50, y:  36, rot:  13, scale: 0.84 },
  { x:  50, y: -36, rot: -13, scale: 0.90 },
];

export function Hero() {
  const sectionRef    = useRef(null);
  const topHalfRef    = useRef(null);
  const bottomHalfRef = useRef(null);
  const contentRef    = useRef(null);
  const scrollHintRef = useRef(null);
  const floatWrapRef  = useRef(null);
  const cardRefs      = useRef([]);

  const { products } = useStore();

  // Pick up to 12 product images (with server URL), fall back to category assets
  const FALLBACK_POOL = [cctv, lock, gate, curtain, lift, touch, sensor, kit, hero, hero2, hero3, hero4];

  const cardData = useMemo(() => {
    const withImg = products
      .filter((p) => resolveImg(p.image))
      .map((p) => ({ src: resolveImg(p.image), name: p.name }));

    const pool =
      withImg.length >= 6
        ? withImg.slice(0, 12)
        : FALLBACK_POOL.slice(0, 12).map((src, i) => ({ src, name: `Product ${i + 1}` }));

    return pool.map((item, i) => ({ ...item, ...POSITIONS[i % POSITIONS.length] }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Entrance animations ─────────────────────────────────── */
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        scrollHintRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.6 }
      );

      /* ── ScrollTrigger master timeline ──────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",   // tighter — releases pin right after cards exit
          scrub: 1.0,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 0→0.35 — hero content fades out
      tl.to(contentRef.current,    { opacity: 0, scale: 0.90, ease: "power2.inOut" }, 0);
      tl.to(scrollHintRef.current, { opacity: 0 }, 0);

      // 0→0.50 — image halves split apart
      tl.to(topHalfRef.current,    { yPercent: -100, ease: "power2.inOut" }, 0);
      tl.to(bottomHalfRef.current, { yPercent:  100, ease: "power2.inOut" }, 0);

      // 0.08 — floating product wrapper fades in
      tl.fromTo(
        floatWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
        0.08
      );

      // Stagger product cards IN — all done by position 0.65
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const pos   = POSITIONS[i % POSITIONS.length];
        const delay = 0.10 + i * 0.04; // tighter stagger

        tl.fromTo(
          el,
          { opacity: 0, scale: 0.4, x: "0%", y: "0%", rotate: 0 },
          {
            opacity: 1,
            scale: pos.scale,
            x: `${pos.x}vw`,
            y: `${pos.y}vh`,
            rotate: pos.rot,
            duration: 0.4,
            ease: "back.out(1.3)",
          },
          delay
        );

        // Independent float oscillation
        gsap.to(el, {
          y: `+=${8 + (i % 3) * 4}`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 2.2 + (i % 4) * 0.5,
          delay: i * 0.18,
        });
      });

      // Cards scatter OUT at 0.68–0.85 — pin releases right after
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const scatter = i % 2 === 0 ? -120 : 120;
        tl.to(
          el,
          { opacity: 0, x: `${scatter}vw`, duration: 0.18, ease: "power3.in" },
          0.66 + i * 0.015
        );
      });

      tl.to(floatWrapRef.current, { opacity: 0, duration: 0.12 }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardData]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-hero"
      style={{ height: "100vh" }}
    >
      {/* ── TOP HALF ─────────────────────────────────────────────── */}
      <div
        ref={topHalfRef}
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: "50%", willChange: "transform" }}
      >
        <img
          src={curtainHeroImg}
          alt="Smart curtain automation"
          className="absolute inset-0 w-full object-cover"
          style={{ height: "200%", objectPosition: "center top" }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── BOTTOM HALF ──────────────────────────────────────────── */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: "50%", willChange: "transform" }}
      >
        <img
          src={curtainHeroImg}
          alt="Smart curtain automation"
          className="absolute inset-x-0 w-full object-cover"
          style={{ height: "200%", bottom: 0, objectPosition: "center bottom" }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── FLOATING PRODUCT CARDS (revealed in the split gap) ───── */}
      <div
        ref={floatWrapRef}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        {cardData.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="absolute"
            style={{
              width: "clamp(160px, 20vw, 280px)",
              willChange: "transform, opacity",
            }}
          >
            {/* Card */}
            <div
              className="overflow-hidden rounded-2xl shadow-2xl border border-white/20 p-1.5"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "1/1" }}>
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Center label */}
        <div className="text-center select-none" style={{ zIndex: 1 }}>
          <p
            className="font-extrabold tracking-tight text-foreground/80"
            style={{ fontSize: "clamp(1rem, 3vw, 2.2rem)" }}
          >
            Discover Our Products
          </p>
          <p
            className="mt-1 text-muted-foreground"
            style={{ fontSize: "clamp(0.7rem, 1.4vw, 1rem)" }}
          >
            Scroll to explore →
          </p>
        </div>
      </div>

      {/* ── HERO CONTENT (center of image) ───────────────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center"
      >


        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-sky-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent select-none">
          {["Smart", "Living,", "Beautifully", "Automated."].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block pr-4 hover:text-white transition-all duration-300 cursor-default"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/80 sm:text-lg md:text-xl"
        >
          CCTV · Digital Door Locks · Automated Gates · Smart Curtains · Lifts &amp; Panels — handpicked from the world's finest brands.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition duration-300 hover:bg-primary hover:text-white hover:scale-[1.04] active:scale-[0.97]"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition duration-300 hover:bg-white/20 hover:scale-[1.04] active:scale-[0.97]"
          >
            Talk to Expert
          </Link>
        </motion.div>
      </div>

      {/* ── SCROLL HINT ──────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>

      {/* Seam line */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ top: "50%", height: "1px", background: "rgba(255,255,255,0.08)" }}
      />
    </section>
  );
}

export default Hero;
