import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero.jpg";


const headline = ["Smart", "Living,", "Beautifully", "Automated."];

export function Hero() {
  useEffect(() => {
    // Only register ScrollTrigger on client side
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Hero image parallax effect
      gsap.to(".hero-parallax-img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-parallax-trigger",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  return (
    <section className="hero-parallax-trigger relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-2 md:items-center md:gap-8 md:pb-24 md:pt-16">
        <motion.div 
          className="relative z-10"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >

          <motion.h1 
            variants={heroItemVariants}
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            {headline.map((w, i) => (
              <span key={i} className="inline-block pr-3 hover:text-primary transition-colors duration-300">
                {w}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            variants={heroItemVariants}
            className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed"
          >
            CCTV, digital door locks, automated gates, curtains, lifts and smart panels — handpicked from the world's best brands and installed by certified pros.
          </motion.p>

          <motion.div 
            variants={heroItemVariants}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-soft transition duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition duration-300 hover:bg-background hover:scale-[1.02] active:scale-[0.98]"
            >
              Talk to an Expert
            </Link>
          </motion.div>


        </motion.div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-border bg-card shadow-lift">
            <img
              src={heroImg}
              alt="A modern smart living room with a glowing wall touch panel"
              width={1600}
              height={1100}
              className="hero-parallax-img h-full w-full object-cover transition-transform duration-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
