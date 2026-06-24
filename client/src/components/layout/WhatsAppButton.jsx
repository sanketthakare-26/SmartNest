import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../../lib/data";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 0.8
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift sm:bottom-7 sm:right-7"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
