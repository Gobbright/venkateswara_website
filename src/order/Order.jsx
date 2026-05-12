import React from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Headphones,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

const Order = () => {
  const trackingSteps = [
    { title: "Order Confirmed", text: "Your product details and payment status are verified.", done: true },
    { title: "Packed With Care", text: "Our team packs sarees, garments, and accessories safely.", done: true },
    { title: "Out For Delivery", text: "Track courier movement and expected delivery timing.", done: false },
    { title: "Delivered", text: "Receive your order and enjoy your shopping experience.", done: false },
  ];

  const productDetails = [
    { label: "Order ID", value: "SVFS-2026-1048" },
    { label: "Product", value: "Premium Silk Saree Collection" },
    { label: "Quantity", value: "1 item" },
    { label: "Payment", value: "Paid online" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF0E6] px-4 py-6 text-[#1a0a00] md:px-16 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] px-6 py-7 text-center shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:px-14 md:py-8">
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
              E-commerce Order Support
            </p>
            <h1 className="mt-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
              Track Your Order
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">
              View your product status, delivery progress, payment details, and
              support information in one place.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Enter Order ID / Mobile Number"
              className="h-12 w-full rounded-full border border-orange-100 bg-orange-50 pl-12 pr-4 text-base outline-none transition focus:border-orange-500 focus:bg-white"
            />
          </div>
          <button className="h-12 rounded-full bg-orange-600 px-8 font-bold text-white transition hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]">
            Track Now
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Product Delivery Details</h2>
                <p className="mt-1 text-sm text-slate-500">Estimated delivery: 2-4 business days</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-[#21747b]">
                <Truck size={18} /> In Transit
              </span>
            </div>

            <div className="mb-7 grid gap-3 sm:grid-cols-2">
              {productDetails.map((item) => (
                <div key={item.label} className="rounded-lg border border-orange-100 bg-[#FFF8F0] p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
                  <p className="mt-1 font-bold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {trackingSteps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      step.done ? "bg-[#4DA7AF] text-white" : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {step.done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">{step.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-lg bg-[#4DA7AF] p-5 text-white shadow-sm">
              <Package className="mb-4" size={34} />
              <h2 className="mb-2 text-2xl font-extrabold">Shopping Made Simple</h2>
              <p className="text-sm leading-6 text-white/85">
                From product confirmation to doorstep delivery, we keep every update clear
                so you know exactly where your order is.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <ShieldCheck className="mb-3 text-orange-600" size={28} />
                <h3 className="font-extrabold">Secure Purchase</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Payment and order information are handled safely for every customer.
                </p>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <Headphones className="mb-3 text-orange-600" size={28} />
                <h3 className="font-extrabold">Need Help?</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Contact support for delivery questions, product changes, or order updates.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-extrabold">
                <MapPin size={20} className="text-orange-600" /> Delivery Address
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Mosque Building, 7, Manthai street, Thennur High Rd, opp. to Tennur, Tiruchirappalli, Tamil Nadu 620017
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                <CreditCard size={18} className="text-[#4DA7AF]" /> Online payment confirmed
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Order;
