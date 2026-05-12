import { useEffect, useState } from "react";
import { X } from "lucide-react";
import banner1 from "../assets/Images/Home/hero.png";
import banner2 from "../assets/Images/Home/hero2.png";
import banner3 from "../assets/Images/Home/hero3.png";

const banners = [banner1, banner2, banner3];

export default function LeftAdBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 20000);

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(timer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] h-[95px] w-[190px] overflow-hidden rounded-lg border border-white/35 bg-white/10 shadow-[0_12px_32px_rgba(26,10,0,0.10)] backdrop-blur-[1px] sm:h-[120px] sm:w-[240px]">
      {banners.map((banner, index) => (
        <img
          key={banner}
          src={banner}
          alt="Shop banner"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === activeIndex ? "opacity-70" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/8 via-orange-600/5 to-[#4DA7AF]/8" />
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close ad"
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-orange-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}
