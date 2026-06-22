import gsap from "gsap";

export const animations = {
  // Fade in animation
  fadeIn: (target, delay = 0, duration = 0.8) => {
    return gsap.fromTo(
      target,
      { opacity: 0 },
      { opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  // Slide and fade in animation
  slideIn: (target, direction = "up", distance = 50, delay = 0, duration = 0.8) => {
    const vars = { opacity: 0 };
    const endVars = { opacity: 1, duration, delay, ease: "power3.out" };

    if (direction === "up") vars.y = distance;
    if (direction === "down") vars.y = -distance;
    if (direction === "left") vars.x = distance;
    if (direction === "right") vars.x = -distance;

    return gsap.fromTo(target, vars, { ...endVars, x: 0, y: 0 });
  },

  // Staggered list fade in
  staggerFadeIn: (targets, stagger = 0.15, delay = 0, duration = 0.6) => {
    return gsap.fromTo(
      targets,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger,
        duration,
        delay,
        ease: "power2.out",
      }
    );
  },

  // Entrance animations for Hero components
  heroEntrance: (title, text, buttons, visual) => {
    const tl = gsap.timeline();
    tl.fromTo(
      title,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }
    )
      .fromTo(
        text,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
        "-=0.3"
      )
      .fromTo(
        visual,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      );
    return tl;
  },
};
