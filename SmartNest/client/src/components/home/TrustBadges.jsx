import { Users, Star, ShieldCheck, Wrench } from "lucide-react";

export function TrustBadges() {
  const items = [
    { icon: Users, label: "500+ Installations" },
    { icon: Star, label: "5-Star Service" },
    { icon: ShieldCheck, label: "20+ Brands" },
    { icon: Wrench, label: "Certified Techs" },
  ];
  return (
    <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {items.map((t, i) => (
        <div key={i} className="flex items-center gap-2 rounded-2xl border border-border bg-background/70 px-3 py-2.5 backdrop-blur">
          <t.icon className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground/80">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
