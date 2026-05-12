import { useState } from "react";
import { Headphones, Mail, MapPin, Phone, Send, Shirt, ShoppingBag } from "lucide-react";
import bgImg from "../assets/Images/bg.png";

const enquiryOptions = [
  "Silk Sarees",
  "Mens Wear",
  "Kids Collection",
  "Festive Wear",
  "Tailoring Service",
];

const branches = [
  {
    name: "Trichy Branch",
    address: "Sri Venkateswara Family Shop, Tiruchirappalli, Tamil Nadu 620001",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.928254782591!2d78.6830595!3d10.8168025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5a09a2db4f1%3A0xc99796d7f5036d41!2sSri%20Venkateswara%20Family%20Shop%20%E2%80%93%20Men%E2%80%99s%2C%20Women%E2%80%99s%20%26%20Kids%20Wear%20%7C%20Trichy!5e0!3m2!1sen!2sin!4v1778240366385!5m2!1sen!2sin",
  },
  {
    name: "Madurai Branch",
    address: "Sri Venkateswara garments, Madurai, Tamil Nadu",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15719.903593313511!2d78.11655978715821!3d9.935963200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c513f3c8dfff%3A0x63ea76f754e4feeb!2sSri%20Venkateswara%20garments-%20Men%27s%20wear%2C%20kids%20wear%2C%20ladies%20garments%20%26%20fashion%20accessories!5e0!3m2!1sen!2sin!4v1778240363556!5m2!1sen!2sin",
  },
];

const ShopEnquiry = () => {
  const [activeBranchName, setActiveBranchName] = useState(branches[0].name);
  const activeBranch =
    branches.find((branch) => branch.name === activeBranchName) ?? branches[0];

  return (
    <section
      className="px-4 py-12 md:px-16 md:py-16"
      style={{
        backgroundColor: "#FAF0E6",
        backgroundImage: `linear-gradient(rgba(250,240,230,0.78), rgba(250,240,230,0.78)), url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 rounded-lg bg-white p-5 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div className="flex flex-col justify-between rounded-lg bg-[#4DA7AF] p-6 text-white">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-orange-200">
              Store Branches
            </p>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl">
              Visit Sri Venkateswara Family Shop
            </h2>
            <div className="mt-6 grid gap-4">
              {branches.map((branch) => (
                <button
                  key={branch.name}
                  type="button"
                  onClick={() => setActiveBranchName(branch.name)}
                  className={`rounded-lg p-4 text-left transition ${
                    activeBranchName === branch.name
                      ? "bg-white text-[#1a0a00] shadow-md"
                      : "bg-white/12 text-white hover:bg-white/20"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin
                      className={`shrink-0 ${
                        activeBranchName === branch.name
                          ? "text-orange-600"
                          : "text-orange-200"
                      }`}
                      size={20}
                    />
                    <p className="font-bold">{branch.name}</p>
                  </div>
                  <p
                    className={`text-sm leading-6 ${
                      activeBranchName === branch.name
                        ? "text-slate-700"
                        : "text-white/85"
                    }`}
                  >
                    {branch.address}
                  </p>
                </button>
              ))}
            </div>
            <iframe
              title={`${activeBranch.name} map`}
              src={activeBranch.mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-5 h-56 w-full rounded-lg border-0 bg-white"
            />
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#1a0a00]">Request Shopping Details</h3>
              <p className="text-sm text-slate-500">We will contact you with product information.</p>
            </div>
          </div>

          <form className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name"
                className="h-12 rounded-lg border border-orange-100 bg-orange-50 px-4 outline-none transition focus:border-orange-500 focus:bg-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="h-12 rounded-lg border border-orange-100 bg-orange-50 px-4 outline-none transition focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="h-12 w-full appearance-none rounded-lg border border-orange-100 bg-orange-50 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:bg-white">
                  <option>Product Category</option>
                  {enquiryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Shirt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Product / Size / Color"
                  className="h-12 w-full rounded-lg border border-orange-100 bg-orange-50 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <textarea
              rows="5"
              placeholder="Tell us what you are looking for..."
              className="resize-none rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white"
            />

            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-7 font-bold text-white transition hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF] md:w-fit"
            >
              Send Enquiry <Send size={18} />
            </button>

            <div className="grid gap-4 rounded-lg bg-orange-50 p-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 shrink-0 text-orange-600" size={18} />
                <div>
                  <p className="font-bold text-slate-900">Call Support</p>
                  <a href="tel:+919876543210" className="!no-underline text-slate-700 hover:text-orange-600">
                    +91 98765 43210
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 shrink-0 text-orange-600" size={18} />
                <div>
                  <p className="font-bold text-slate-900">Email Us</p>
                  <a
                    href="mailto:care@venkateshwaratextiles.in"
                    className="!no-underline text-slate-700 hover:text-orange-600"
                  >
                    care@venkateshwaratextiles.in
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-orange-600" size={18} />
                <p>
                  Mosque Building, 7, Manthai street, Thennur High Rd, opp. to Tennur, Tiruchirappalli, Tamil Nadu 620017
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ShopEnquiry;
