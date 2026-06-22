import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ variant = "spinner", count = 3 }) => {
  if (variant === "skeleton") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
            <div className="bg-slate-800 rounded-xl h-48 w-full"></div>
            <div className="h-6 bg-slate-800 rounded w-2/3"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-6 bg-slate-800 rounded w-1/4"></div>
              <div className="h-8 bg-slate-800 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12 w-full">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default Loader;
