import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-dark hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary-hover shadow-lg shadow-secondary/20",
    outline: "border border-slate-700 text-gray-300 hover:border-primary hover:text-primary bg-transparent",
    ghost: "text-gray-400 hover:text-white hover:bg-slate-800/50 bg-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-inherit" />}
      {children}
    </button>
  );
};

export default Button;
