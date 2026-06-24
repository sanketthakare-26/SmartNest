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
      className="fixed bottom-5 right-5 z-40 shadow-lift sm:bottom-7 sm:right-7"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-2xl bg-[#25D366]" />
      {/* Complete Official WhatsApp Logo — rounded green square + white icon */}
      <svg
        className="relative h-14 w-14"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded square background */}
        <rect width="56" height="56" rx="14" fill="#25D366" />

        {/* White speech bubble shape with tail */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M28 10C18.059 10 10 18.059 10 28C10 31.178 10.857 34.152 12.352 36.71L10 46L19.56 43.7C22.05 45.1 24.93 45.9 28 45.9C37.941 45.9 46 37.841 46 27.9C46 17.959 37.941 10 28 10Z"
          fill="white"
        />

        {/* Phone handset — same green as background, sits inside white bubble */}
        <path
          d="M36.5 32.07C36.1 31.87 34.04 30.86 33.68 30.73C33.32 30.6 33.06 30.54 32.8 30.94C32.54 31.34 31.74 32.27 31.51 32.54C31.28 32.81 31.05 32.84 30.65 32.64C30.25 32.44 28.95 32.01 27.4 30.63C26.19 29.56 25.39 28.24 25.16 27.84C24.93 27.44 25.13 27.23 25.34 27.02C25.53 26.83 25.74 26.53 25.95 26.3C26.16 26.07 26.23 25.9 26.36 25.63C26.49 25.36 26.43 25.13 26.33 24.93C26.23 24.73 25.46 22.75 25.15 21.98C24.85 21.23 24.54 21.33 24.31 21.32L23.62 21.31C23.36 21.31 22.94 21.41 22.57 21.82C22.2 22.23 21.2 23.17 21.2 25.14C21.2 27.11 22.61 29.02 22.81 29.29C23.01 29.56 25.39 33.22 28.96 34.83C29.82 35.21 30.5 35.45 31.02 35.62C31.97 35.93 32.84 35.88 33.52 35.78C34.28 35.66 35.88 34.84 36.21 33.95C36.54 33.06 36.54 32.31 36.44 32.14C36.34 31.97 36.08 31.87 35.68 31.67L36.5 32.07Z"
          fill="#25D366"
        />
      </svg>
    </motion.a>
  );
}
