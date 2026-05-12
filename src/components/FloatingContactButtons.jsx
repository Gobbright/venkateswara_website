import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const phoneNumber = "919876543210";
const displayPhone = "+91 98765 43210";
const whatsappText =
  "Hi Sri Venkateswara Family Shop, I need help with shopping.";

export default function FloatingContactButtons() {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      <a
        href={`tel:+${phoneNumber}`}
        className="group flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-orange-600 text-white shadow-md transition-all duration-300 !no-underline hover:w-40 hover:justify-start hover:gap-2 hover:px-5 focus:outline-none sm:h-14 sm:w-14"
        aria-label={`Call ${displayPhone}`}
      >
        <Phone size={26} className="shrink-0" />
        <span className="w-0 whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:w-auto group-hover:opacity-100">
          Call Now
        </span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-[#25D366] text-white shadow-md transition-all duration-300 !no-underline hover:w-40 hover:justify-start hover:gap-2 hover:px-5 focus:outline-none sm:h-14 sm:w-14"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={30} className="shrink-0" />
        <span className="w-0 whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:w-auto group-hover:opacity-100">
          Chat Now
        </span>
      </a>
    </div>
  );
}
