import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/context/StoreContext";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.startsWith("/uploads/") || src.startsWith("uploads/")) return `${BASE_URL}/${src.replace(/^\//, "")}`;
  return null;
}

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


// Full-screen scatter — corners, edges, and mid positions across the whole viewport
const POSITIONS = [
  // Top-left corner
  { x: -62, y: -42, rot: -15, scale: 0.82 },
  // Top-right corner
  { x:  62, y: -42, rot:  13, scale: 0.84 },
  // Bottom-left corner
  { x: -62, y:  40, rot:  12, scale: 0.80 },
  // Bottom-right corner
  { x:  62, y:  40, rot: -14, scale: 0.83 },
  // Far left center
  { x: -70, y:  -6, rot:  -8, scale: 0.78 },
  // Far right center
  { x:  70, y:   6, rot:  10, scale: 0.79 },
  // Top center
  { x:  -8, y: -46, rot:   6, scale: 0.85 },
  // Bottom center
  { x:   8, y:  44, rot:  -6, scale: 0.86 },
  // Mid left upper
  { x: -52, y: -26, rot: -18, scale: 0.81 },
  // Mid right lower
  { x:  52, y:  28, rot:  16, scale: 0.82 },
  // Mid left lower
  { x: -52, y:  26, rot:  14, scale: 0.80 },
  // Mid right upper
  { x:  52, y: -28, rot: -12, scale: 0.83 },
];

const HERO_SLIDES = [hero, hero2, hero3, hero4];

// Each slide has a unique CSS animation class name
const SLIDE_ANIMATIONS = [
  "hero-anim-kenburns",   // slide 0: zoom-in (Ken Burns)
  "hero-anim-pan-right",  // slide 1: slow pan right
  "hero-anim-pan-left",   // slide 2: slow pan left
  "hero-anim-zoomout",    // slide 3: zoom-out + slight drift
];

// Inject CSS keyframes once
const HERO_STYLE = `
  @keyframes hero-kenburns {
    0%   { transform: scale(1.12) translate(0%, 0%); }
    100% { transform: scale(1.0)  translate(-1%, -1%); }
  }
  @keyframes hero-pan-right {
    0%   { transform: scale(1.08) translateX(-4%); }
    100% { transform: scale(1.05) translateX(2%); }
  }
  @keyframes hero-pan-left {
    0%   { transform: scale(1.08) translateX(4%); }
    100% { transform: scale(1.05) translateX(-2%); }
  }
  @keyframes hero-zoomout {
    0%   { transform: scale(1.15) translate(1%, -1%); }
    100% { transform: scale(1.02) translate(-1%, 1%); }
  }
  .hero-anim-kenburns  { animation: hero-kenburns  8s ease-in-out both; }
  .hero-anim-pan-right { animation: hero-pan-right 8s ease-in-out both; }
  .hero-anim-pan-left  { animation: hero-pan-left  8s ease-in-out both; }
  .hero-anim-zoomout   { animation: hero-zoomout   8s ease-in-out both; }
  .hero-slide-in  { animation: heroFadeIn  1.5s ease-in-out forwards; }
  .hero-slide-out { animation: heroFadeOut 1.5s ease-in-out forwards; }
  @keyframes heroFadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes heroFadeOut { from { opacity: 1; } to { opacity: 0; } }
`;

export function Hero() {
  const sectionRef    = useRef(null);
  const topHalfRef    = useRef(null);
  const bottomHalfRef = useRef(null);
  const contentRef    = useRef(null);
  const scrollHintRef = useRef(null);
  const floatWrapRef  = useRef(null);
  const cardRefs      = useRef([]);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);



  const { products } = useStore();

  // Fallback pool — category images used when not enough product images exist
  const FALLBACK_POOL = [cctv, lock, gate, curtain, lift, touch, sensor, kit];

  const cardData = useMemo(() => {
    // Get all products that have a resolvable image, then shuffle randomly
    const withImg = products
      .filter((p) => resolveImg(p.image))
      .map((p) => ({ src: resolveImg(p.image), name: p.name }))
      .sort(() => Math.random() - 0.5); // random shuffle each render

    const pool =
      withImg.length >= 6
        ? withImg.slice(0, 12) // use up to 12 random product images
        : FALLBACK_POOL.map((src, i) => ({ // fallback to category images
            src,
            name: ["CCTV", "Smart Locks", "Automated Gates", "Smart Curtains", "Lifts & Panels", "Touch Controls", "Sensors", "Smart Kits"][i],
          }));

    return pool.map((item, i) => ({ ...item, ...POSITIONS[i % POSITIONS.length] }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        setPrevSlide(prev);
        return (prev + 1) % HERO_SLIDES.length;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isMobile } = context.conditions;
        
        // Multiplier to keep cards close to the screen edges on mobile without clipping heavily or overlapping
        const xMult = isMobile ? 0.6 : 1.0;
        const yMult = isMobile ? 0.65 : 1.0;

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

        /* ── ScrollTrigger master timeline ──────────────────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=280%",   // tighter range — categories appear sooner after cards exit
            scrub: 3,        // heavy damping = very smooth & slow response
            pin: true,
            anticipatePin: 1,
          },
        });

        // 0→0.30 — hero content fades out
        tl.fromTo(contentRef.current,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.90, duration: 0.3, ease: "power2.inOut" },
          0
        );
        tl.fromTo(scrollHintRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.15 },
          0
        );

        // 0→0.40 — image halves split apart
        tl.fromTo(topHalfRef.current,
          { yPercent: 0 },
          { yPercent: -100, duration: 0.4, ease: "power2.inOut" },
          0
        );
        tl.fromTo(bottomHalfRef.current,
          { yPercent: 0 },
          { yPercent: 100, duration: 0.4, ease: "power2.inOut" },
          0
        );

        // 0.08→0.23 — floating product wrapper fades in
        tl.fromTo(
          floatWrapRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.15, ease: "power1.out" },
          0.08
        );

        // Stagger product cards IN — spread across 0.10 → 0.46 (fully settled by 0.46)
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const pos   = POSITIONS[i % POSITIONS.length];
          const delay = 0.10 + i * 0.015; // tighter stagger for entrance

          tl.fromTo(
            el,
            { opacity: 0, scale: 0.4, x: "0%", y: "0%", rotate: 0 },
            {
              opacity: 1,
              scale: isMobile ? pos.scale * 0.95 : pos.scale,
              x: `${pos.x * xMult}vw`,
              y: `${pos.y * yMult}vh`,
              rotate: pos.rot,
              duration: 0.20, // shorter duration per card
              ease: "back.out(1.3)",
            },
            delay
          );

          // Independent float oscillation in all directions (left, right, upward, downward, corners)
          const innerCard = el.firstElementChild;
          if (innerCard) {
            // Calculate drift direction based on final position
            const driftX = (pos.x > 0 ? 4 : pos.x < 0 ? -4 : 0) * (isMobile ? 0.6 : 1.0);
            const driftY = (pos.y > 0 ? 4 : pos.y < 0 ? -4 : 0) * (isMobile ? 0.6 : 1.0);
            
            gsap.to(innerCard, {
              x: driftX,
              y: driftY,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              duration: 20.0 + (i % 4) * 2.0, // extremely slow drift 20–26s
              delay: i * 0.5,
            });
          }
        });

        // Cards scatter OUT at 0.70–0.88 - fly out in all directions (left, right, up, down)
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const pos = POSITIONS[i % POSITIONS.length];
          // Explode outward radially from the center
          let targetX = pos.x * xMult * 2.8;
          let targetY = pos.y * yMult * 2.8;
          // Ensure even near-center cards exit the screen completely
          if (Math.abs(targetX) < 40) targetX = i % 2 === 0 ? -120 : 120;
          if (Math.abs(targetY) < 40) targetY = i % 2 === 0 ? -120 : 120;

          tl.to(
            el,
            {
              opacity: 0,
              x: `${targetX}vw`,
              y: `${targetY}vh`,
              scale: 0.2,
              rotate: pos.rot * 2,
              duration: 0.12, // fast exit duration
              ease: "power2.in",
            },
            0.70 + i * 0.012
          );
        });

        tl.to(floatWrapRef.current, { opacity: 0, duration: 0.10 }, 0.88);
      }
    );

    return () => mm.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardData]);

  return (
    <>
      <style>{HERO_STYLE}</style>
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
          {/* Previous slide fading out */}
          {prevSlide !== null && (
            <img
              key={`top-prev-${prevSlide}`}
              src={HERO_SLIDES[prevSlide]}
              alt=""
              className={`absolute inset-0 w-full object-cover hero-slide-out ${SLIDE_ANIMATIONS[prevSlide]}`}
              style={{ height: "200%", objectPosition: "center top" }}
              draggable={false}
            />
          )}
          {/* Current slide fading in + unique animation */}
          <img
            key={`top-curr-${currentSlide}`}
            src={HERO_SLIDES[currentSlide]}
            alt="Hero background"
            className={`absolute inset-0 w-full object-cover hero-slide-in ${SLIDE_ANIMATIONS[currentSlide]}`}
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
          {/* Previous slide fading out */}
          {prevSlide !== null && (
            <img
              key={`bot-prev-${prevSlide}`}
              src={HERO_SLIDES[prevSlide]}
              alt=""
              className={`absolute inset-x-0 w-full object-cover hero-slide-out ${SLIDE_ANIMATIONS[prevSlide]}`}
              style={{ height: "200%", bottom: 0, objectPosition: "center bottom" }}
              draggable={false}
            />
          )}
          {/* Current slide fading in + unique animation */}
          <img
            key={`bot-curr-${currentSlide}`}
            src={HERO_SLIDES[currentSlide]}
            alt=""
            className={`absolute inset-x-0 w-full object-cover hero-slide-in ${SLIDE_ANIMATIONS[currentSlide]}`}
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
            className="absolute w-[110px] sm:w-[150px] md:w-[185px] lg:w-[220px]"
            style={{
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
    </>
  );
}

export default Hero;
