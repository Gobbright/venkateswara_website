import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, X } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import footerLogo from "../assets/Images/sri-venkateswara-logo.png";

const footerModals = {
  privacy: {
    title: "Privacy Policy",
    content:
      "Sri Venkateswara Family Shop respects your privacy and protects the personal details you share with us. We may collect your name, phone number, email address, delivery address, and order details only to process purchases, provide customer support, send order updates, and improve your shopping experience. We do not sell your personal information to third parties. Payment information is handled through trusted and secure payment providers. You may contact our support team to update your details or request help regarding your information.",
  },
  terms: {
    title: "Terms of Service",
    content:
      "By using this website, you agree to shop responsibly and provide accurate order, contact, and delivery information. Product images, colors, prices, and availability may vary slightly based on screen display, stock, and store updates. Orders are confirmed after successful payment or store approval. Cancellations, returns, and exchanges may depend on product type, usage condition, and store policy. Sri Venkateswara Family Shop may update website content, offers, and service terms whenever required.",
  },
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);
  const modal = activeModal ? footerModals[activeModal] : null;

  return (
    <footer id="site-footer" className="bg-[#4DA7AF] text-white px-8 md:px-16 py-10">

      {/* Main Footer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 pb-8 border-b border-white/20">

        {/* Column 1 - Logo + About */}
        <div className="flex flex-col gap-4 md:col-span-1 md:pr-8 md:border-r md:border-white/20">
          <div className="inline-flex w-fit flex-col gap-2 rounded-lg border border-white/35 bg-white/95 px-4 py-3 shadow-sm">
            <img src={footerLogo} alt="Sri Venkateswara Family Shop" className="h-16 w-auto max-w-[230px] object-contain" />
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Crafting timeless textiles since 1999. Where tradition meets contemporary elegance.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 hover:border-orange-300 transition !no-underline text-white hover:text-orange-300">
              <FaInstagram size={16} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 hover:border-orange-300 transition !no-underline text-white hover:text-orange-300">
              <FaFacebookF size={16} />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 hover:border-orange-300 transition !no-underline text-white hover:text-orange-300">
              <FaWhatsapp size={16} />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 hover:border-orange-300 transition !no-underline text-white hover:text-orange-300">
              <FaYoutube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div className="flex flex-col gap-3 md:pl-8">
          <h3 className="text-lg font-bold text-orange-300 mb-1">Quick Links</h3>
          <Link to="/home" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Home</Link>
          <Link to="/mens" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Shop</Link>
          <Link to="/video-call" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Video Call</Link>
          <Link to="/other/about" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">About</Link>
          <Link to="/other/contact" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Contact</Link>
          <Link to="/categories" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Categories</Link>
        </div>

        {/* Column 3 - Categories */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-orange-300 mb-1">Categories</h3>
          <Link to="/mens" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Men</Link>
          <Link to="/womens" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Women</Link>
          <Link to="/kids" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Kids</Link>
          <Link to="/accessories" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Accessories</Link>
          <Link to="/today-deals" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Weekly Offers</Link>
          <Link to="/festive-wear" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Festive Wear</Link>
          <Link to="/order/track" className="!no-underline text-white/80 hover:text-orange-300 text-base transition">Track Order</Link>
        </div>

        {/* Column 4 - Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-orange-300 mb-1">Contact</h3>
          <span className="flex items-start gap-2 text-base text-white/80">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            Mosque Building, 7, Manthai street, Thennur High Rd, opp. to Tennur, Tiruchirappalli, Tamil Nadu 620017
          </span>
          <span className="flex items-center gap-2 text-base text-white/80">
            <Phone size={18} className="shrink-0" />
            +91 98765 43210
          </span>
          <span className="flex items-center gap-2 text-base text-white/80">
            <Mail size={18} className="shrink-0" />
            care@venkateshwaratextiles.in
          </span>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-3 text-sm text-white/70">
        <p>
          <span className="text-lg">&copy;</span> 2026 <span className="font-semibold text-orange-300">Sri Venkateswara Family Shop</span>. All rights reserved. Developed by{" "}
          <a
            href="https://gobrightglobal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-300 hover:text-white transition !no-underline font-semibold"
          >
            GoBright
          </a>
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="text-white/70 hover:text-orange-300 transition"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            className="text-white/70 hover:text-orange-300 transition"
          >
            Terms of Service
          </button>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/40 p-6 text-slate-900 shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,243,230,0.76) 52%, rgba(225,251,248,0.76) 100%)",
              backdropFilter: "blur(14px)",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-700 transition hover:bg-orange-500 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="mb-3 pr-10 text-2xl font-bold text-[#1a0a00]">
              {modal.title}
            </h3>
            <p className="text-sm leading-7 text-slate-700">{modal.content}</p>
          </div>
        </div>
      )}

    </footer>
  );
};

export default Footer;
