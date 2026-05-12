import { Shield, RotateCcw, Lock, Headphones } from "lucide-react";
import bgImg from "../assets/Images/bg.png";

const trustItems = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Every weave inspected by our master artisans.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return on all orders.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "256-bit encrypted, trusted gateways.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Dedicated team available 7 days a week.",
  },
];

function TrustCard({ icon: Icon, title, description }) {
  return (
    <div className="group relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-xl border border-orange-100 bg-white px-6 py-7 text-center shadow-[0_6px_20px_rgba(26,10,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-orange-300 hover:bg-[#fff8ef] hover:shadow-[0_18px_38px_rgba(232,81,10,0.18)]">
      <span className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-orange-600 via-[#FFBE8A] to-[#4DA7AF] transition-transform duration-300 group-hover:scale-x-100" />
      <span className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#4DA7AF]/0 transition duration-300 group-hover:bg-[#4DA7AF]/12" />

      <div className="relative mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white shadow-[0_10px_24px_rgba(232,81,10,0.24)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-[0_12px_28px_rgba(77,167,175,0.24)]">
        <Icon size={26} strokeWidth={1.9} />
      </div>

      <h3
        className="mb-2 text-base font-bold text-[#1a0a00] transition-colors duration-300 group-hover:text-orange-700"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[#7a5c4a] transition-colors duration-300 group-hover:text-[#2f6167]">
        {description}
      </p>
    </div>
  );
}

export default function Trust() {
  return (
    <section
      className="w-full px-6 py-16"
      style={{
        backgroundColor: "#FFF0E0",
        backgroundImage: `linear-gradient(rgba(255,240,224,0.78), rgba(255,240,224,0.78)), url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <h2
        className="mb-12 text-center text-4xl font-bold"
        style={{ color: "#1a0a00", fontFamily: "Georgia, serif" }}
      >
        Woven With <span style={{ color: "#E8510A" }}>Trust</span>
      </h2>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <TrustCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
