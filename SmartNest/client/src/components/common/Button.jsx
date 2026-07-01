import { cn } from "@/lib/utils";

export function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/95 active:scale-98 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
