import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useScrollAnimation = (animationType = "fade-up", options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let fromVars = { opacity: 0 };
    let toVars = {
      opacity: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        ...options.scrollTrigger,
      },
      duration: 0.8,
      ease: "power2.out",
      ...options,
    };

    if (animationType === "fade-up") {
      fromVars.y = 40;
      toVars.y = 0;
    } else if (animationType === "fade-down") {
      fromVars.y = -40;
      toVars.y = 0;
    } else if (animationType === "fade-left") {
      fromVars.x = 40;
      toVars.x = 0;
    } else if (animationType === "fade-right") {
      fromVars.x = -40;
      toVars.x = 0;
    } else if (animationType === "scale-up") {
      fromVars.scale = 0.95;
      toVars.scale = 1;
    }

    const anim = gsap.fromTo(el, fromVars, toVars);

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [animationType]);

  return elementRef;
};

export default useScrollAnimation;
