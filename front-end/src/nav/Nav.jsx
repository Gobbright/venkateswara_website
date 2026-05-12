import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart, ShoppingCart, User, MapPin, Truck, Headphones, Video, Search, X, ChevronDown, Phone, Mail, Menu
} from "lucide-react";
import { useState } from "react";
import logoImg from "../assets/Images/logo.png";
import { getShopNotificationCount } from "../utils/shopNotifications";

const Nav = () => {
  const location = useLocation();
  const [otherOpen, setOtherOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getShopNotificationCount("cart"));
  const [wishlistCount, setWishlistCount] = useState(() => getShopNotificationCount("wishlist"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const otherCloseTimer = useRef(null);

  const otherLinks = [
    { name: "All Categories", path: "/categories" },
    { name: "Accessories", path: "/accessories" },
    { name: "Festive Wear", path: "/festive-wear" },
    // { name: "Tailoring", path: "/ot  her/tailoring" },
    { name: "About", path: "/other/about" },
    { name: "Contact", path: "/other/contact" },
    { name: "Track Order", path: "/order/track" },
  ];

  const mainLinks = [
    { name: "Home", path: "/home" },
    { name: "Mens", path: "/mens" },
    { name: "Womens", path: "/womens" },
    { name: "Kids", path: "/kids" },
  ];

  const showOtherDropdown = () => {
    if (otherCloseTimer.current) {
      clearTimeout(otherCloseTimer.current);
    }
    setOtherOpen(true);
  };

  const hideOtherDropdown = () => {
    otherCloseTimer.current = setTimeout(() => {
      setOtherOpen(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("site-footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;

      setNavCompact(window.scrollY > 80);
      setFooterVisible(footerTop <= window.innerHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleNotificationChange = (event) => {
      if (event.detail?.type === "cart") {
        setCartCount(event.detail.count);
      }

      if (event.detail?.type === "wishlist") {
        setWishlistCount(event.detail.count);
      }
    };

    const syncNotifications = () => {
      setCartCount(getShopNotificationCount("cart"));
      setWishlistCount(getShopNotificationCount("wishlist"));
    };

    window.addEventListener("shop-notification-change", handleNotificationChange);
    window.addEventListener("storage", syncNotifications);

    return () => {
      window.removeEventListener("shop-notification-change", handleNotificationChange);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  return (
    <>

      {/* Top Bar */}
      <div className="w-full bg-[#4DA7AF] text-white px-4 md:px-16 py-0.5">
        <div className="flex items-center justify-between gap-6 whitespace-nowrap overflow-x-auto">
          <p className="flex items-center text-sm md:text-base font-medium m-0">
            Welcome to Sri Venkateswara Family Shop
          </p>
          <div className="flex items-center gap-6 md:gap-10 ml-4">
            <span className="flex items-center gap-1 text-sm md:text-base">
              <MapPin size={16} /> Tennur,Tiruchirappalli
            </span>
            <Link to="/order/track" className="flex items-center gap-1 text-sm md:text-base !no-underline text-white transition">
              <Truck size={16} /> Track Order
            </Link>
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="flex items-center gap-1 text-sm md:text-base transition"
            >
              <Headphones size={16} /> Help & Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`sticky z-50 border-0 bg-[#FFEED8] shadow-none transition-all duration-300 ${
          footerVisible
            ? "pointer-events-none top-2 mx-2 w-[calc(100%-16px)] -translate-y-full rounded-2xl bg-[#FFEED8]/85 px-4 py-2 opacity-0 backdrop-blur-md md:mx-4 md:w-[calc(100%-32px)] md:px-12 md:py-3"
            : navCompact
            ? "top-2 mx-1 w-[calc(100%-8px)] rounded-2xl bg-[#FFEED8]/85 px-2 py-1.5 backdrop-blur-md md:mx-2 md:w-[calc(100%-16px)] md:px-6 md:py-2"
            : "top-0 w-full rounded-none px-4 py-2 md:px-12 md:py-3"
        }`}
      >

          {/* Top Row */}
          <div className="flex items-center justify-between gap-3">

            {/* Logo */}
            <img src={logoImg} alt="logo" className="h-14 w-auto origin-left scale-125 object-contain md:h-18" />

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-black shadow-sm transition hover:bg-white md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Menu (Desktop only) */}
            <ul className="hidden md:flex gap-6 font-semibold text-black text-sm xl:gap-8 xl:text-base">
              {mainLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="!no-underline text-black transition hover:text-orange-600">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li
                className="relative"
                onMouseEnter={showOtherDropdown}
                onMouseLeave={hideOtherDropdown}
              >
                <button
                  type="button"
                  onClick={() => setOtherOpen(!otherOpen)}
                  className="flex items-center gap-1 text-black transition hover:text-orange-600"
                >
                  Others
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${otherOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {otherOpen && (
                  <div
                    className="absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 overflow-hidden rounded-xl shadow-xl ring-1 ring-black/5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,243,230,0.72) 48%, rgba(225,251,248,0.72) 100%)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {otherLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setOtherOpen(false)}
                        className="block !no-underline px-5 py-3 text-sm font-semibold text-black transition hover:text-orange-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-4 md:gap-6 text-black font-semibold">

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center gap-5 text-sm">
                <Link to="/video-call" className="nav-call-button group relative h-10 w-[190px] overflow-hidden text-white px-4 !rounded-full text-sm font-semibold transition !no-underline">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 group-hover:left-[calc(100%-42px)]">
                    <Video size={19} />
                  </span>
                  <span className="inline-flex h-full items-center justify-center whitespace-nowrap pl-6 transition-all duration-300 group-hover:-translate-x-8 group-hover:opacity-0">
                    Video Call Purchase
                  </span>
                  <span className="absolute left-7 top-1/2 -translate-y-1/2 translate-x-6 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Schedule Call
                  </span>
                </Link>
                <Link to="/wishlist" className="relative flex items-center gap-1 !no-underline text-black cursor-pointer transition hover:text-orange-600">
                  <span className="relative">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </span>
                  Wishlist
                </Link>
                <Link to="/cart" className="relative flex items-center gap-1 !no-underline text-black cursor-pointer transition hover:text-orange-600">
                  <span className="relative">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  Cart
                </Link>
              </div>
            </div>
          </div>

      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm md:hidden">
          <div className="flex h-dvh w-full flex-col overflow-y-auto bg-[#FFEED8] px-5 pb-8 pt-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <img src={logoImg} alt="logo" className="h-16 w-auto" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-black shadow-sm transition hover:bg-white"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-2 text-center">
              {mainLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-white/45 px-4 py-3 !no-underline text-center text-lg font-semibold text-black transition hover:text-orange-600"
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-2 rounded-xl bg-white/35 p-4">
                <p className="mb-3 text-center text-lg font-semibold text-black">Others</p>
                {otherLinks.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 !no-underline text-center text-base font-medium text-black transition hover:bg-white/50 hover:text-orange-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-2 space-y-2 border-t border-black/10 pt-4">
                <Link
                  to="/video-call"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-[#4DA7AF] px-4 py-3 !no-underline text-center text-lg font-semibold text-white transition"
                >
                  <Video size={20} />
                  Video Call Purchase
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/45 px-4 py-3 !no-underline text-center text-lg font-semibold text-black transition hover:text-orange-600"
                >
                  <Heart size={20} />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-bold leading-none text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/45 px-4 py-3 !no-underline text-center text-lg font-semibold text-black transition hover:text-orange-600"
                >
                  <ShoppingCart size={20} />
                  Cart
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-xs font-bold leading-none text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/45 px-4 py-3 !no-underline text-center text-lg font-semibold text-black transition hover:text-orange-600"
                >
                  <User size={20} />
                  Login
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Bottom Row */}
      <div
        className={`border-0 bg-[#FFEED8] shadow-none transition-all duration-300 ${
          footerVisible
            ? "pointer-events-none mx-2 mt-1 w-[calc(100%-16px)] -translate-y-full rounded-2xl bg-[#FFEED8]/85 px-4 py-2 opacity-0 backdrop-blur-md md:mx-4 md:w-[calc(100%-32px)] md:px-12 md:py-2"
            : navCompact
            ? "mx-1 mt-1 w-[calc(100%-8px)] rounded-2xl bg-[#FFEED8]/85 px-2 py-1.5 backdrop-blur-md md:mx-2 md:w-[calc(100%-16px)] md:px-6 md:py-2"
            : "w-full rounded-none px-4 pb-2 md:px-12 md:pb-3"
        }`}
      >
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">

            <Link
              to="/video-call"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-[#4DA7AF] px-6 text-sm font-semibold text-white transition !no-underline hover:scale-[1.03] md:hidden"
            >
              <Video size={19} />
              Video Call
            </Link>

            {/* Search */}
            {searchOpen ? (
              <div className="relative w-full flex-1 rounded-full transition-all duration-300">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="relative w-full rounded-full bg-teal-100 pl-11 pr-12 py-2 text-sm outline-none transition hover:bg-white focus:bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group relative h-10 w-full flex-1 overflow-hidden bg-white px-4 rounded-full text-sm font-semibold text-black transition !no-underline hover:scale-[1.02] md:w-[200px] shadow-sm"
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-500 group-hover:left-[calc(100%-42px)]">
                  <Search size={19} />
                </span>
                <span className="inline-flex h-full items-center justify-center whitespace-nowrap pl-6 transition-all duration-300 group-hover:-translate-x-8 group-hover:opacity-0">
                  Search Products
                </span>
                <span className="absolute left-7 top-1/2 -translate-y-1/2 translate-x-6 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Find Now
                </span>
              </button>
            )}

            {/* User + Login */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/login" className="bg-orange-600 text-white px-5 py-2 !rounded-full text-sm font-semibold transition !no-underline hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]">
                Login
              </Link>
            </div>

          </div>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
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
              onClick={() => setSupportOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-700 transition hover:bg-orange-500 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="mb-3 pr-10 text-2xl font-bold text-[#1a0a00]">
              Help & Support
            </h3>
            <p className="mb-5 text-sm leading-7 text-slate-700">
              Need help with shopping, order tracking, delivery updates, product
              availability, exchanges, or tailoring service details? Our support team
              will help you with clear information and quick assistance.
            </p>
            <div className="space-y-3 rounded-xl bg-white/55 p-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 !no-underline text-slate-800 transition hover:text-orange-600"
              >
                <Phone size={18} className="text-orange-600" />
                +91 98765 43210
              </a>
              <a
                href="mailto:care@venkateshwaratextiles.in"
                className="flex items-center gap-3 !no-underline text-slate-800 transition hover:text-orange-600"
              >
                <Mail size={18} className="text-orange-600" />
                care@venkateshwaratextiles.in
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
