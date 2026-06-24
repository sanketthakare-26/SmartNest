import { motion } from "framer-motion";

export function SpecTable({ specs }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  if (!specs || specs.length === 0) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="border-b border-border bg-secondary/60 px-5 py-3 text-sm font-bold uppercase tracking-wider text-foreground/80">Specifications</div>
      <motion.table 
        className="w-full text-sm"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <tbody>
          {specs.map((s) => (
            <motion.tr 
              key={s.label} 
              className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
              variants={itemVariants}
            >
              <td className="w-1/2 px-5 py-3 font-medium text-muted-foreground">{s.label}</td>
              <td className="px-5 py-3 font-semibold text-foreground">{s.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
