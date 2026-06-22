import React from "react";
import { MessageSquare } from "lucide-react";

const WhatsAppButton = ({ phoneNumber = "1234567890", message = "Hi! I am interested in SmartNest automation devices." }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group"
      title="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-white text-[#25D366] group-hover:rotate-6 transition-transform" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold">
        Enquire Now
      </span>
    </a>
  );
};

export default WhatsAppButton;
