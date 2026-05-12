import React from "react";
import { Link } from "react-router-dom";
import bannerImg from "../assets/Images/Home/11.png";
import bgImg from "../assets/Images/bg.png";
import { ArrowRight } from "lucide-react";

const Offer = () => {
  return (
    <div
      className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-10 md:py-12"
      style={{
        backgroundColor: "#FAF0E6",
        backgroundImage: `linear-gradient(rgba(250,240,230,0.78), rgba(250,240,230,0.78)), url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden flex items-stretch min-h-[330px] sm:min-h-[390px] md:min-h-[450px] bg-[#7ECDD1] shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
        <img
          src={bannerImg}
          alt="Festive Collection"
          className="absolute inset-y-0 right-0 h-full w-full object-contain object-right"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(126,205,209,0.94)_0%,rgba(126,205,209,0.78)_58%,rgba(126,205,209,0.48)_100%)] sm:bg-[linear-gradient(to_right,#7ECDD1_0%,rgba(126,205,209,0.97)_24%,rgba(126,205,209,0.82)_38%,rgba(126,205,209,0.38)_56%,transparent_76%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-36 bg-gradient-to-r from-[#7ECDD1] via-[#7ECDD1]/80 to-transparent blur-xl sm:block" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-7 sm:px-14 md:px-20 py-7 sm:py-10 w-full sm:max-w-2xl">

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm md:text-base font-semibold tracking-widest text-white/90 uppercase">
              Limited Time Offer
            </span>
            <span className="text-white text-sm md:text-base">*</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-nowrap">
            Flat <span className="text-yellow-400">30% OFF</span> on
            <br />Festive Collections
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-7 max-w-xl">
            Adorn this season's celebrations in heritage silks and
            hand-embroidered ensembles. Offer ends soon.
          </p>

          <Link
            to="/festive-wear"
            className="!no-underline inline-flex items-center gap-2 bg-orange-500 text-white font-semibold text-base px-7 py-3.5 rounded-full transition w-fit hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF] shadow-[0_4px_15px_rgba(249,115,22,0.5)] hover:shadow-[0_6px_20px_rgba(77,167,175,0.35)]"
          >
            Shop the Sale
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Offer;
