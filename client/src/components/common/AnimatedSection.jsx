import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const AnimatedSection = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.8,
  className = "",
  tag: Tag = "div",
  ...props
}) => {
  const ref = useScrollAnimation(animation, {
    delay,
    duration,
  });

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
};

export default AnimatedSection;
