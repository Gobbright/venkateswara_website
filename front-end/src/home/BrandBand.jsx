import React from "react";
import nalliLogo from "../assets/Images/Brands/nalli.svg";
import pothysLogo from "../assets/Images/Brands/pothys.svg";
import chennaiSilksLogo from "../assets/Images/Brands/chennai-silks.svg";
import rmkvLogo from "../assets/Images/Brands/rmkv.svg";
import ramrajLogo from "../assets/Images/Brands/ramraj.svg";
import kalyanSilksLogo from "../assets/Images/Brands/kalyan-silks.svg";
import kumaranSilksLogo from "../assets/Images/Brands/kumaran-silks.svg";
import manyavarLogo from "../assets/Images/Brands/manyavar.svg";

const brandLogos = [
  {
    name: "Nalli",
    image: nalliLogo,
  },
  {
    name: "Pothys",
    image: pothysLogo,
  },
  {
    name: "The Chennai Silks",
    image: chennaiSilksLogo,
  },
  {
    name: "RMKV Silks",
    image: rmkvLogo,
  },
  {
    name: "Ramraj Cotton",
    image: ramrajLogo,
  },
  {
    name: "Kalyan Silks",
    image: kalyanSilksLogo,
  },
  {
    name: "Kumaran Silks",
    image: kumaranSilksLogo,
  },
  {
    name: "Manyavar",
    image: manyavarLogo,
  },
];

const BrandBand = () => {
  return (
    <section className="bg-[#FAF5EE] px-4 py-8 md:px-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-orange-100 bg-white py-5 shadow-sm">
        <div className="brand-logo-track flex w-max items-center gap-8">
          {[...brandLogos, ...brandLogos].map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-[#FFF8F0] px-4"
            >
              <img
                src={brand.image}
                alt={`${brand.name} logo`}
                className="h-14 w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandBand;
